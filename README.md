# BeatCSV

BeatCSV is a system currently under development designed for data analysis, with a focus on evaluating the quality of data contained in .CSV files.

The system is intended to eventually analyze information contained in databases, expanding its scope and reaching a much larger user base.

To test the system you must follow the next steps:

1. Have Python and Node.js already installed on your computer.

   https://www.python.org/downloads/
   https://nodejs.org/es/download

2. Clone this repository using the command:

```cmd
git clone <the url>
```

3. Navigate to the backend and frontend folders to install the dependencies:

  Backend:
  ```cmd
  cd backend
  pip install -r requirements.txt
  ```

  Frontend:
  ```cmd
  cd frontend
  npm install
  ```

4. Run the following commands to start the project:

  Backend:
  ```cmd
  cd backend
  uvicorn app.main:app --reload 
  ```

  Frontend:
  ```cmd
  cd frontend
  npm run dev
  ```

Any feedback is welcome. If you'd like to support this project, please feel free to contact me through the contact information listed on my profile.
