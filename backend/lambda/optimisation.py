import json
import os
from datetime import datetime, timedelta
# import pulp
from supabase import create_client, Client
import traceback
from scipy.optimize import linprog
import numpy as np

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


def lambda_handler(event: str, context: dict) -> dict:
    try:
        # Extract opening_id from SQS event
        event_dict = json.loads(event)
        sqs_message = event_dict['Records'][0]['body']
        opening_id = sqs_message['opening_id']

        print("Opening ID Set")

        # Fetch opening details and availabilities from database
        set_opening_status(opening_id, 'I')
        interviewers, interviewer_availabilities = get_interviewer_availabilities(
            opening_id)
        interviewees, interviewee_availabilities = get_interviewee_availabilities(
            opening_id)
        interview_duration_minutes = get_interview_length(opening_id)

        print("Data Fetched")
        print("Interviewer Availabilities: ")
        print(interviewer_availabilities)
        print("Interviewee Availabilities: ")
        print(interviewee_availabilities)
        # Solve the scheduling problem
        schedule = solve_scheduling_problem_scipy(
            interviewer_availabilities,
            interviewee_availabilities,
            interview_duration_minutes
        )
        print("Scheduling Completed")
        records = process_schedule_for_db(schedule, interviewers, interviewees)

        print("Schedule Processing Completed")
        print("Records: ")
        print(records)

        # Write the schedule to database
        write_schedule_to_db(opening_id, records)
        set_opening_status(opening_id, 'S')

        print("Data Written")
        supabase.table('OPENING').update({'interview_allocation_status': 'S'}).eq('id', opening_id).execute()
        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Scheduling completed successfully"})
        }
    except Exception as e:
        print("Error occurred: ", e)
        traceback.print_exc()


def set_opening_status(opening_id: int, status: str) -> dict:
    data = {'interview_allocation_status': status}
    response = supabase.table('OPENING').update(
        data).eq('id', opening_id).execute()
    return response.data[0] if response.data else None


def get_interview_length(opening_id: int) -> int:
    # response = supabase.table('RECRUITMENT_ROUND').select('interview_period')
    return 30


def get_interviewee_availabilities(opening_id: int) -> tuple[list, list]:
    response = supabase.table('APPLICATION').select(
        'id, candidate_availability').eq('opening_id', opening_id).execute()
    return [item['id'] for item in response.data if item['candidate_availability'] is not None], [item['candidate_availability'] for item in response.data if item['candidate_availability'] is not None]


# def get_interviewer_availabilities(opening_id):
#     response = supabase.table('TEAM_LEAD_ASSIGNMENT') \
#         .select('''
#         PROFILE!inner(id,interview_availability)
#     ''') \
#         .eq('opening_id', opening_id) \
#         .execute()
#     return [item['id'] for item in response.data], [item['interview_availability'] for item in response.data]


def get_interviewer_availabilities(opening_id: int) -> tuple[list, list]:
    response = supabase.table('TEAM_LEAD_ASSIGNMENT') \
        .select('PROFILE(id, interview_availability)') \
        .eq('opening_id', opening_id) \
        .execute()
    interviewers = [item['PROFILE']['id']
                    for item in response.data if item['PROFILE']['interview_availability'] is not None]
    availabilities = [item['PROFILE']['interview_availability']
                      for item in response.data if item['PROFILE']['interview_availability'] is not None]
    return interviewers, availabilities


def process_schedule_for_db(schedule: list, interviewers: list, interviewees: list) -> None:
    records = []
    print("Schedule: ", schedule)
    print("Interviewers: ", interviewers)
    print("Interviewees: ", interviewees)
    for interview in schedule:
        if isinstance(interview, str):
            interview = json.loads(interview)
        if interview['interviewer_index'] is None or interview['interview_time'] is None:
            continue
        records.append(
            {
                'application_id': interviewees[interview['interviewee_index']],
                'interview_date': interview['interview_time'],
                'profile_id': interviewers[interview['interviewer_index']],
            }
        )

    return records


def write_schedule_to_db(opening_id: int, records: list) -> None:
    for item in records:
        # supabase.table('APPLICATION').insert({
        #     'opening_id': opening_id,
        #     'interview_date': item['interview_date'],
        #     'profile_id': item['profile_id']
        # }).execute()

        supabase.table('APPLICATION').update({
            'interview_date': item['interview_date'],
            'profile_id': item['profile_id']
        }).eq('opening_id', opening_id).eq('id', item['application_id']).execute()


# This may be used for the algorithm in deploymend
def solve_scheduling_problem(interviewer_availabilities: list, interviewee_availabilities: list, interview_duration_minutes: int) -> list:
    # Process availabilities
    all_availabilities = interviewer_availabilities + interviewee_availabilities
    print("All Availabilities: ", all_availabilities)
    time_slots, availability_matrix = process_availabilities(
        all_availabilities, interview_duration_minutes)

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
    prob.solve(pulp.PULP_CBC_CMD())

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


def solve_scheduling_problem_scipy(interviewer_availabilities, interviewee_availabilities, interview_duration_minutes):
    time_slots, availability_matrix = process_availabilities(
        interviewer_availabilities + interviewee_availabilities,
        interview_duration_minutes
    )

    n_interviewers = len(interviewer_availabilities)
    n_interviewees = len(interviewee_availabilities)
    n_timeslots = len(time_slots)

    # Flatten the decision variables
    n_vars = n_interviewers * n_interviewees * n_timeslots

    # Objective: Maximize the number of scheduled interviews
    c = np.ones(n_vars)

    # Constraints
    A_ub = []
    b_ub = []

    # Each interviewee is interviewed at most once
    for j in range(n_interviewees):
        constraint = np.zeros(n_vars)
        constraint[j*n_interviewers *
                   n_timeslots:(j+1)*n_interviewers*n_timeslots] = 1
        A_ub.append(constraint)
        b_ub.append(1)

    # Each interviewer has at most one interview at a time
    for i in range(n_interviewers):
        for t in range(n_timeslots):
            constraint = np.zeros(n_vars)
            for j in range(n_interviewees):
                idx = i + j*n_interviewers + t*n_interviewers*n_interviewees
                constraint[idx] = 1
            A_ub.append(constraint)
            b_ub.append(1)

    # Availability constraints
    for i in range(n_interviewers):
        for j in range(n_interviewees):
            for t in range(n_timeslots):
                if availability_matrix[i][t] == 0 or availability_matrix[n_interviewers + j][t] == 0:
                    constraint = np.zeros(n_vars)
                    idx = i + j*n_interviewers + t*n_interviewers*n_interviewees
                    constraint[idx] = 1
                    A_ub.append(constraint)
                    b_ub.append(0)

    # Solve the problem
    res = linprog(-c, A_ub=A_ub, b_ub=b_ub, method='highs')

    # Process results
    schedule = []
    if res.success:
        x = res.x.reshape((n_interviewees, n_interviewers, n_timeslots))
        for j in range(n_interviewees):
            interview_time = None
            interviewer_index = None
            for i in range(n_interviewers):
                for t in range(n_timeslots):
                    if x[j, i, t] > 0.5:  # Using 0.5 as a threshold due to potential floating-point imprecision
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
    else:
        print("Optimization failed:", res.message)

    return schedule


def process_availabilities(availabilities: list, interview_duration_minutes: str) -> tuple[list, list[list[int]]]:
    print("Availabilities: ", availabilities)
    all_times = set()
    for availability in availabilities:
        print("Availability: ", availability)
        # if isinstance(availability, str):
        #     availability = json.loads(availability)
        #     print("Availability JSON: ", availability)
        for slot in availability:
            print("Slot: ", slot)
            if isinstance(slot, str):
                slot = json.loads(slot)
            start = datetime.fromisoformat(
                slot['start'].replace('Z', '+00:00'))
            end = datetime.fromisoformat(slot['end'].replace('Z', '+00:00'))
            current = start
            while current <= end - timedelta(minutes=interview_duration_minutes):
                all_times.add(current)
                current += timedelta(minutes=15)  # Assuming 15-minute slots

    time_slots = sorted(list(all_times))
    n_slots = len(time_slots)
    n_people = len(availabilities)

    availability_matrix = [
        [0 for _ in range(n_slots)] for _ in range(n_people)]

    for person, availability in enumerate(availabilities):
        # if isinstance(availability, str):
        #     availability = json.loads(availability)
        for slot in availability:
            if isinstance(slot, str):
                slot = json.loads(slot)
            start = datetime.fromisoformat(
                slot['start'].replace('Z', '+00:00'))
            end = datetime.fromisoformat(slot['end'].replace('Z', '+00:00'))
            for i, time in enumerate(time_slots):
                if start <= time < end:
                    availability_matrix[person][i] = 1

    return time_slots, availability_matrix
