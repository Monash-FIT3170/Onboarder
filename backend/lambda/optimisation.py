import json
import os
from datetime import datetime, timedelta
from minizinc import Instance, Model, Solver
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


def lambda_handler(event, context):
    # Extract opening_id from SQS event
    sqs_message = json.loads(event['Records'][0]['body'])
    opening_id = sqs_message['opening_id']

    # Fetch opening details and availabilities from database
    set_opening_status(opening_id, 'I')
    interviewers, interviewer_availabilities = get_interviewer_availabilities(opening_id)
    interviewees, interviewee_availabilities = get_interviewee_availabilities(opening_id)
    interview_duration_minutes = get_interview_length(opening_id)

    # Solve the scheduling problem
    schedule = solve_scheduling_problem(
        interviewer_availabilities,
        interviewee_availabilities,
        interview_duration_minutes
    )
    records = process_schedule_for_db(schedule, interviewers, interviewees)

    # Write the schedule to database
    write_schedule_to_db(opening_id, records)
    set_opening_status(opening_id, 'S')

    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Scheduling completed successfully"})
    }


# POTENTIALLY THIS IS DONE IN API
def set_opening_status(opening_id, status):
    data = {'interview_allocation_status': status}
    response = supabase.table('OPENING').update(data).eq('id', opening_id).execute()
    return response.data[0] if response.data else None

def get_interview_length(opening_id):
    # response = supabase.table('RECRUITMENT_ROUND').select('interview_period')
    return 30

def get_interviewee_availabilities(opening_id):
    response = supabase.table('APPLICATION').select('id, candidate_availability').eq('opening_id', opening_id).execute()
    return [item['id'] for item in response.data], [item['candidate_availability'] for item in response.data]

def get_interviewer_availabilities(opening_id):
    response = supabase.table('PROFILE') \
        .select('id, interview_availability') \
        .join("TEAM_LEAD_ASSIGNMENT", "TEAM_LEAD_ASSIGNMENT.profile_id", "PROFILE.id") \
        .eq('TEAM_LEAD_ASSIGNMENT.opening_id', opening_id) \
        .execute()
    return [item['id'] for item in response.data], [item['interview_availability'] for item in response.data]

def write_schedule_to_db(opening_id, records):
    for item in records:
        supabase.table('APPLICATION').insert({
            'application_id': opening_id,
            'interview_date': item['interview_date'],
            'interviewer_id': item['interviewer_id']
        }).execute()


def process_schedule_for_db(schedule, interviewers, interviewees):
    records = []
    for interview in schedule:
        records.append(
            {
                'application_id': interviewees[interview['interviewee_index']],
                'interview_date': interview['interview_time'],
                'interviewer_id': interviewers[interview['interviewer_index']],
            }
        )


def solve_scheduling_problem(interviewer_availabilities, interviewee_availabilities, interview_duration_minutes):
    # Process availabilities
    all_availabilities = interviewer_availabilities + interviewee_availabilities
    time_slots, availability_matrix = process_availabilities(all_availabilities, interview_duration_minutes)

    n_interviewers = len(interviewer_availabilities)
    n_interviewees = len(interviewee_availabilities)
    n_timeslots = len(time_slots)

    interviewer_avail = availability_matrix[:n_interviewers]
    interviewee_avail = availability_matrix[n_interviewers:]

    # MiniZinc model
    mzn_model = r"""
    int: n_interviewers;
    int: n_interviewees;
    int: n_timeslots;

    array[1..n_interviewers, 1..n_timeslots] of int: interviewer_avail;
    array[1..n_interviewees, 1..n_timeslots] of int: interviewee_avail;
    int: interview_length;

    array[1..n_interviewers, 1..n_interviewees, 1..n_timeslots] of var bool: interview_scheduled;

    % Constraints
    constraint forall(i in 1..n_interviewees) (
        sum(j in 1..n_interviewers, t in 1..n_timeslots) (interview_scheduled[j, i, t]) <= 1
    );

    constraint forall(j in 1..n_interviewers, t in 1..n_timeslots) (
        sum(i in 1..n_interviewees) (interview_scheduled[j, i, t]) <= 1
    );

    constraint forall(j in 1..n_interviewers, i in 1..n_interviewees, t in 1..n_timeslots-interview_length+1) (
        interview_scheduled[j, i, t] -> 
        forall(k in 0..interview_length-1) (
            interviewer_avail[j, t+k] == 1 /\ interviewee_avail[i, t+k] == 1
        )
    );

    % Objective variables
    var int: total_interviews = sum(j in 1..n_interviewers, i in 1..n_interviewees, t in 1..n_timeslots) (
        interview_scheduled[j, i, t]
    );

    array[1..n_interviewers] of var int: interviewer_load = [
        sum(i in 1..n_interviewees, t in 1..n_timeslots) (interview_scheduled[j, i, t])
        | j in 1..n_interviewers
    ];

    var int: max_load = max(interviewer_load);
    var int: min_load = min(interviewer_load);
    var int: load_difference = max_load - min_load;

    % Multi-objective optimization
    solve maximize total_interviews * 100 - load_difference;
    """

    # Set up and solve MiniZinc model
    model = Model()
    model.add_string(mzn_model)
    solver = Solver.lookup("cbc")
    instance = Instance(solver, model)

    instance["n_interviewers"] = n_interviewers
    instance["n_interviewees"] = n_interviewees
    instance["n_timeslots"] = n_timeslots
    instance["interview_length"] = interview_duration_minutes // 30  # Assuming 30-minute slots
    instance["interviewer_avail"] = interviewer_avail
    instance["interviewee_avail"] = interviewee_avail

    result = instance.solve()

    # Process results
    interview_scheduled = result["interview_scheduled"]
    schedule = []

    for i in range(n_interviewees):
        interview_time = None
        interviewer_index = None

        for j in range(n_interviewers):
            for t in range(n_timeslots):
                if interview_scheduled[j][i][t]:
                    interview_time = time_slots[t]
                    interviewer_index = j
                    break
            if interview_time:
                break

        schedule.append({
            "interviewee_index": i,
            "interview_time": interview_time.isoformat() if interview_time else None,
            "interviewer_index": interviewer_index
        })

    return schedule

def process_availabilities(availabilities, interview_duration_minutes):
    all_times = set()
    for availability in availabilities:
        for slot in json.loads(availability):
            start = datetime.fromisoformat(slot['start'].replace('Z', '+00:00'))
            end = datetime.fromisoformat(slot['end'].replace('Z', '+00:00'))
            current = start
            while current <= end - timedelta(minutes = interview_duration_minutes):
                all_times.add(current)
                current += timedelta(minutes=15)

    time_slots = sorted(list(all_times))
    n_slots = len(time_slots)
    n_people = len(availabilities)

    availability_matrix = [[0 for _ in range(n_slots)] for _ in range(n_people)]

    for person, availability in enumerate(availabilities):
        for slot in json.loads(availability):
            start = datetime.fromisoformat(slot['start'].replace('Z', '+00:00'))
            end = datetime.fromisoformat(slot['end'].replace('Z', '+00:00'))
            for i, time in enumerate(time_slots):
                if start <= time < end:
                    availability_matrix[person][i] = 1

    return time_slots, availability_matrix

if __name__=="__main__":
    int1 = ['[{"start": "2024-08-26T16:15:00.000Z", "end": "2024-08-27T00:00:00.000Z", "title": "Available Slot"},{"start": "2024-08-25T17:30:00.000Z", "end": "2024-08-25T18:00:00.000Z", "title": "Available Slot"}]'] * 10
    int2 = ['[{"start": "2024-08-26T16:30:00.000Z", "end": "2024-08-27T00:00:00.000Z", "title": "Available Slot"},{"start": "2024-08-25T17:30:00.000Z", "end": "2024-08-25T18:00:00.000Z", "title": "Available Slot"}]'] * 30
    minutes = 30
    print(solve_scheduling_problem(int1, int2, minutes))