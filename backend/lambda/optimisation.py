from minizinc import Instance, Model, Solver

# Define the MiniZinc model as a raw string to avoid escape sequence issues
mzn_model = r"""
int: n_interviewers;
int: n_interviewees;
int: n_timeslots;

array[1..n_interviewers, 1..n_timeslots] of int: interviewer_avail;
array[1..n_interviewees, 1..n_timeslots] of int: interviewee_avail;
int: interview_length;

array[1..n_interviewers, 1..n_interviewees, 1..n_timeslots] of var bool: interview_scheduled;

% Constraints

% Each interviewee can only have one interview
constraint forall(i in 1..n_interviewees) (
    sum(j in 1..n_interviewers, t in 1..n_timeslots) (interview_scheduled[j, i, t]) <= 1
);

% Interviewer can only interview one person at a time
constraint forall(j in 1..n_interviewers, t in 1..n_timeslots) (
    sum(i in 1..n_interviewees) (interview_scheduled[j, i, t]) <= 1
);

% Interviews can only happen if both are available and fit within the timeslot
constraint forall(j in 1..n_interviewers, i in 1..n_interviewees, t in 1..n_timeslots-interview_length+1) (
    interview_scheduled[j, i, t] -> 
    forall(k in 0..interview_length-1) (
        interviewer_avail[j, t+k] == 1 /\ interviewee_avail[i, t+k] == 1
    )
);

% Maximize the number of interviews and minimize the variance in interview counts
var int: total_interviews = sum(j in 1..n_interviewers, i in 1..n_interviewees, t in 1..n_timeslots) (
    interview_scheduled[j, i, t]
);


solve maximize total_interviews;
"""

# Load the model from the string
model = Model()
model.add_string(mzn_model)

# Define a solver
solver = Solver.lookup("chuffed")

# Create an instance
instance = Instance(solver, model)

# Define data
n_interviewers = 3
n_interviewees = 4
n_timeslots = 10
interview_length = 2

interviewer_avail = [
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 0, 0, 1, 1, 1, 1]
]

interviewee_avail = [
    [1, 1, 0, 0, 1, 1, 0, 1, 1, 1],
    [0, 1, 1, 1, 0, 1, 1, 0, 1, 0],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 0],
    [0, 1, 1, 1, 1, 0, 1, 1, 0, 1]
]

# Assign data to the instance
instance["n_interviewers"] = n_interviewers
instance["n_interviewees"] = n_interviewees
instance["n_timeslots"] = n_timeslots
instance["interview_length"] = interview_length
instance["interviewer_avail"] = interviewer_avail
instance["interviewee_avail"] = interviewee_avail

# Solve the model
result = instance.solve()

# Output the solution
interview_scheduled = result["interview_scheduled"]
print("Total Interviews Scheduled:", result["objective"])
print("Interview Schedule:")
for j in range(n_interviewers):
    for i in range(n_interviewees):
        for t in range(n_timeslots):
            if interview_scheduled[j][i][t]:
                print(f"Interviewer {j+1} interviews Interviewee {i+1} at Time Slot {t+1}")
