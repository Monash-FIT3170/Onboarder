import json
import os
from datetime import datetime, timedelta
import pulp
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


def lambda_handler(event, context):
    try:
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
    except Exception as e:
        print(e)

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
    response = supabase.table('TEAM_LEAD_ASSIGNMENT') \
        .select('''
        PROFILE!inner(
            id,
            interview_availability
        )
    ''') \
        .eq('opening_id', opening_id) \
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

# Create PuLP problem
    prob = pulp.LpProblem("Interview_Scheduling", pulp.LpMaximize)

    # Decision variables
    interview_scheduled = pulp.LpVariable.dicts("interview",
                                                ((i, j, t) for i in range(n_interviewers)
                                                            for j in range(n_interviewees)
                                                            for t in range(n_timeslots)),
                                                cat='Binary')

    # Objective function
    total_interviews = pulp.lpSum(interview_scheduled[i, j, t] 
                                  for i in range(n_interviewers)
                                  for j in range(n_interviewees)
                                  for t in range(n_timeslots))
    
    interviewer_load = [pulp.lpSum(interview_scheduled[i, j, t] 
                                   for j in range(n_interviewees)
                                   for t in range(n_timeslots))
                        for i in range(n_interviewers)]
    
    max_load = pulp.LpVariable("max_load", lowBound=0, cat='Integer')
    min_load = pulp.LpVariable("min_load", lowBound=0, cat='Integer')

    prob += 100 * total_interviews - (max_load - min_load)

    # Constraints
    for j in range(n_interviewees):
        prob += pulp.lpSum(interview_scheduled[i, j, t] 
                           for i in range(n_interviewers)
                           for t in range(n_timeslots)) <= 1

    for i in range(n_interviewers):
        for t in range(n_timeslots):
            prob += pulp.lpSum(interview_scheduled[i, j, t] 
                               for j in range(n_interviewees)) <= 1

    interview_length = interview_duration_minutes // 15  # Assuming 15-minute slots
    for i in range(n_interviewers):
        for j in range(n_interviewees):
            for t in range(n_timeslots - interview_length + 1):
                prob += interview_scheduled[i, j, t] <= min(interviewer_avail[i][t+k] * interviewee_avail[j][t+k] 
                                                            for k in range(interview_length))

    for i in range(n_interviewers):
        prob += max_load >= interviewer_load[i]
        prob += min_load <= interviewer_load[i]

    # Solve the problem
    prob.solve()

    # Process results
    schedule = []
    for j in range(n_interviewees):
        interview_time = None
        interviewer_index = None
        for i in range(n_interviewers):
            for t in range(n_timeslots):
                if pulp.value(interview_scheduled[i, j, t]) == 1:
                    interview_time = time_slots[t]
                    interviewer_index = i
                    break
            if interview_time:
                break
        schedule.append({
            "interviewee_index": j,
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
                current += timedelta(minutes=15) # Assuming 15-minute slots

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
