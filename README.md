# Onboarder

Recruitment platform for Monash University student teams

Please install NodeJS, Docker, AWS CLI and AWS SAM CLI on your local machine.
Make sure docker is running before running local server.

## To launch Front-End:

Execute in front-end folder: (cd frontend)
npm install
npm run dev

Enter "/viewrecruitmentround" after localhost to access Admin View  
Enter "/applicant-openings" after localhost to access Applicant View

## To Launch the Backend Server

Create an `env.json` file in the root directory:

- Fill in the values from the Discord channel named resources.

Navigate to the root folder:

```
sam build
sam local start-api --warm-containers EAGER --env-vars env.json
```

Members: /
Antony Razzell /
Daniel Hong /
Umair Bin Mohammad /
Tavishi Saxena /
Shubh Bajpai /
Ahmad Hafiz
Tran Ngoc Duy Ngo /
Fahad Saeed Assadi /
Hanif Mohammad Asif
Nguyen Khang Huynh /
Rahul Sahni /
Sai Ashish Ramishetty /
Rahul Saxena /
Jesse Cruickshank /
