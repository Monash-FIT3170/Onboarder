import json
from datetime import datetime, timedelta
from minizinc import Instance, Model, Solver
import boto3

def lambda_handler(event, context):
    # Parse input
    interviewer_availabilities = json.loads(event['interviewer_availabilities'])
    interviewee_availabilities = json.loads(event['interviewee_availabilities'])
    interview_duration_minutes = event.get('interview_duration_minutes', 60)

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
    solve maximize total_interviews - load_difference;
    """

    # Set up and solve MiniZinc model
    model = Model()
    model.add_string(mzn_model)
    solver = Solver.lookup("chuffed")
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

    return {
        "statusCode": 200,
        "body": json.dumps(schedule)
    }

def process_availabilities(availabilities, interview_duration_minutes):
    all_times = set()
    for availability in availabilities:
        for slot in json.loads(availability):
            start = datetime.fromisoformat(slot['start'].replace('Z', '+00:00'))
            end = datetime.fromisoformat(slot['end'].replace('Z', '+00:00'))
            current = start
            while current < end:
                all_times.add(current)
                current += timedelta(minutes=30)

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

# for local testing
if __name__ == "__main__":
    # sample event for testing
    test_event = {
        "interviewer_availabilities": json.dumps([
            '[{"start": "2024-08-26T16:30:00.000Z", "end": "2024-08-27T00:00:00.000Z", "title": "Available Slot"}]',
            '[{"start": "2024-08-25T17:30:00.000Z", "end": "2024-08-25T18:00:00.000Z", "title": "Available Slot"}]'
        ]),
        "interviewee_availabilities": json.dumps([
            '[{"start": "2024-08-26T16:30:00.000Z", "end": "2024-08-27T00:00:00.000Z", "title": "Available Slot"}]',
            '[{"start": "2024-08-25T17:30:00.000Z", "end": "2024-08-25T18:00:00.000Z", "title": "Available Slot"}]'
        ]),
        "interview_duration_minutes": 60
    }
    print(lambda_handler(test_event, None))
