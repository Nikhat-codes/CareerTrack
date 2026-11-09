# CareerTrack – Full-Stack Job Portal & Recruitment Management System

CareerTrack is a MERN-stack job portal that connects job seekers with employers through a public job application portal and an administrator dashboard. Visitors can explore published job openings and submit applications with a resume without creating a candidate account. Administrators can manage job postings and review applications from the dashboard.

## Live Project

- **Frontend:** https://career-track-two.vercel.app
- **Backend API:** https://careertrack-vvpy.onrender.com
- **Backend health check:** https://careertrack-vvpy.onrender.com/api/health

> Note: The backend is hosted on Render's free service. It may take a short time to respond when it has been inactive.

## Main Features

### Public Portal
- View published job openings.
- Search and browse available jobs.
- Open individual job details.
- Submit a job application without candidate registration.
- Upload a resume with the application.
- Track an application using the application ID and email.

### Admin Dashboard
- Admin authentication and protected dashboard access.
- View dashboard statistics.
- Create, update and manage job postings.
- Control job publication status.
- View and manage candidate applications.
- Filter applications by job, status and date.
- Update application status and save internal notes.
- Download candidate resumes.
- Export application data as CSV.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Axios |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Token (JWT), bcrypt |
| File Upload | Multer |
| API Testing | Postman |
| Deployment | Vercel (frontend), Render (backend) |

## Repository Structure

The structure below follows the files and folders currently present in this GitHub repository.

```text
CareerTrack/
├── .postman/
│   └── resources.yaml
├── Backend/
│   ├── Docs/
│   │   ├── API_Documentation.pdf
│   │   ├── Database_Schema.pdf
│   │   └── Test_Cases.xlsx
│   ├── screenshots/
│   │   ├── admin_dashboard.png
│   │   ├── application_Form1.png
│   │   ├── application_Form2.png
│   │   ├── application_management.png
│   │   ├── job_details.png
│   │   └── public_portal.png
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env.example
│   ├── checkAdmin.js
│   ├── createAdmin.js
│   ├── resetAdminPassword.js
│   ├── verifyPassword.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App-backup.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── index.html
│   └── vite.config.js
├── postman/
├── .gitignore
├── Deployment_Links.txt
├── GitHub_Repository_Link.txt
├── Project_Report.pdf
└── README.md
```

## Run the Project Locally

You need Node.js, npm and access to a MongoDB database.

### 1. Clone the repository

```bash
git clone https://github.com/Nikhat-codes/CareerTrack.git
cd CareerTrack
```

### 2. Set up the backend

```bash
cd Backend
npm install
```

Create a private `.env` file using the variable names in `Backend/.env.example`, and add your own configuration values. Do not share or commit this file.

Start the backend using the start or development script listed in `Backend/package.json`.

### 3. Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create a private `.env` file using the variable names in `frontend/.env.example`, if frontend environment variables are required.

Start the Vite development server:

```bash
npm run dev
```

Open the local URL shown in the terminal.

## Project Documentation

The repository includes the following project documents:

- **Project Report:** `Project_Report.pdf` (repository root)
- **API Documentation:** `Backend/Docs/API_Documentation.pdf`
- **Database Schema:** `Backend/Docs/Database_Schema.pdf`
- **Test Cases:** `Backend/Docs/Test_Cases.xlsx`
- **Screenshots:** `Backend/screenshots/`
- **Postman resources:** `.postman/` and `postman/`

## Deployment

- Frontend is deployed on Vercel.
- Backend API is deployed on Render.
- The backend health endpoint can be used to check whether the API is responding: `/api/health`.

## Security Notes

- Do not commit `.env` files, database credentials, JWT secrets or other private keys.
- Do not commit `node_modules` or generated build folders.
- Use dummy data in demonstrations and screenshots.
- Keep administrative routes protected.
- Treat uploaded resumes and candidate information as private data.

## Author

**Nikhat Siddekee**  
B.Tech – Computer Science and Engineering

---

If you find an issue or want to understand the project, start with the live frontend, then refer to the project report and API documentation.
