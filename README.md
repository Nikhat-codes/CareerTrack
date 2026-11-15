CareerTrack – Full-Stack Job Portal & Recruitment Management System
CareerTrack is a MERN-stack job portal that connects job seekers with employers through a public job application portal and an administrator dashboard.
Visitors can explore published job openings, view job details and submit applications with a résumé without creating a candidate account. Administrators can manage job postings and review candidate applications through a secure dashboard.
1. Live Project
- Frontend: https://career-track-two.vercel.app
- Backend API: https://careertrack-vvpy.onrender.com
- Backend Health Check: https://careertrack-vvpy.onrender.com/api/health
- GitHub Repository: https://github.com/Nikhat-codes/CareerTrack
Note: The backend is hosted on Render's free service. It may take a short time to respond after a period of inactivity.
2. Project Objectives
- Develop a complete full-stack recruitment management platform.
- Allow visitors to browse and search published job openings.
- Enable candidates to apply without creating an account.
- Provide secure administrator authentication.
- Allow administrators to manage jobs and applications.
- Provide application tracking using an application ID and email address.
- Store uploaded résumés securely using Cloudinary.
3. Main Features
A. Public Job Portal
- View published job openings.
- Search and browse available jobs.
- View individual job details.
- Submit applications without candidate registration.
- Upload résumés with applications.
- Track application progress using application ID and email.
- Receive application submission confirmation.
B. Candidate Application Module
- Collect candidate name, email, phone number and education details.
- Accept additional experience, skills and cover letter information.
- Support PDF, DOC and DOCX résumé uploads.
- Validate required fields and résumé file requirements.
- Prevent duplicate applications for the same job and email combination.
- Reject applications for unavailable or expired jobs.
C. Admin Dashboard
- Administrator login and protected dashboard access.
- View dashboard statistics.
- Create, update and manage job postings.
- Control job publication status.
- View and manage candidate applications.
- Filter applications by job, status and date.
- Update application status.
- Add internal recruitment notes.
- Download candidate résumés.
- Export application records as CSV.
D. Application Status Workflow
Applications can move through the following statuses:
1. Submitted
2. Under Review
3. Shortlisted
4. Interview Scheduled
5. Selected
6. Rejected
4. Technology Stack
LayerTechnologiesFrontendReact, Vite, JavaScript, CSSRoutingReact RouterAPI CommunicationAxiosBackendNode.js, Express.jsDatabaseMongoDB, MongooseAuthenticationJSON Web Token (JWT), bcryptFile UploadMulterCloud StorageCloudinaryAPI TestingPostmanVersion ControlGit, GitHubFrontend DeploymentVercelBackend DeploymentRender
5. System Architecture
CareerTrack follows a client-server architecture.
1. The React frontend provides the public portal and administrator interface.
2. Axios sends HTTP requests to the Express REST API.
3. Express routes direct requests to the appropriate controllers.
4. Middleware handles administrator authentication and résumé upload processing.
5. Mongoose models communicate with MongoDB.
6. Cloudinary stores uploaded résumé files.
7. The backend returns responses to the frontend.
Main Database Models
- Job: Stores job details, requirements, publication status and related information.
- Application: Stores candidate application details, résumé metadata, application status and internal notes.
- Admin: Stores administrator account information.
6. Repository Structure
The following structure represents the main project folders and files.
CareerTrack/
│
├── .postman/
│   └── resources.yaml
│
├── Backend/
│   ├── Docs/
│   │   ├── API_Documentation.pdf
│   │   ├── Database_Schema.pdf
│   │   └── Test_Cases.xlsx
│   │
│   ├── screenshots/
│   │   ├── Job_Details.png
│   │   ├── admin_dashboard.png
│   │   ├── application_Form1.png
│   │   ├── application_form2.png
│   │   ├── application_management.png
│   │   └── public_portal.png
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── checkAdmin.js
│   ├── createAdmin.js
│   ├── resetAdminPassword.js
│   ├── verifyPassword.js
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   │
│   │   ├── pages/
│   │   │   ├── AdminApplications.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminJobs.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── HomePage.jsx
│   │   │   └── TrackApplication.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App-backup.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vercel.json
│   └── vite.config.js
│
├── postman/
├── .gitignore
├── Deployment_Links.txt
├── GitHub_Repository_Link.txt
├── Project_Report.pdf
├── README.md
├── checkAdmin.js
├── createAdmin.js
├── resetAdminPassword.js
├── verifyPassword.js
├── package.json
└── package-lock.json
7. Prerequisites
Before running the project locally, install:
- Node.js
- npm
- MongoDB database or MongoDB Atlas account
- Git
- Code editor such as Visual Studio Code
- Postman for API testing
8. Run the Project Locally
Step 1: Clone the Repository
git clone https://github.com/Nikhat-codes/CareerTrack.git

cd CareerTrack
Step 2: Backend Setup
cd Backend
npm install
Create a private .env file using the variable names provided in Backend/.env.example.
Configure the required database connection, authentication and Cloudinary settings.
Start the backend using the start or development script defined in Backend/package.json.
Step 3: Frontend Setup
Open another terminal:
cd frontend
npm install
Create a private .env file using the variable names in frontend/.env.example, if required.
Start the Vite development server:
npm run dev
Open the local URL displayed in the terminal.
9. Database Configuration
CareerTrack uses MongoDB for persistent data storage and Mongoose for schema definition and database operations.
The main collections are:
- Jobs
- Applications
- Admins
The database connection is configured through backend environment variables.
The application model uses a unique compound index on job and email to prevent duplicate applications for the same job.
Refer to Backend/Docs/Database_Schema.pdf for the database structure, important fields, relationships and indexes.
10. API Documentation
The backend provides REST API endpoints under the /api base path.
Main endpoint groups include:
- /api/jobs – Public job listing and job details.
- /api/applications – Application submission, tracking and management.
- /api/auth – Administrator authentication.
- /api/admin/jobs – Administrator job management.
- /api/dashboard – Dashboard statistics.
Protected administrator endpoints require a valid JWT bearer token.
Refer to Backend/Docs/API_Documentation.pdf for the endpoint list, HTTP methods, access requirements and descriptions.
11. File Upload and Storage
- Résumé uploads are processed using Multer memory storage.
- Accepted formats are PDF, DOC and DOCX.
- Maximum permitted file size is 5 MB.
- Uploaded résumé files are stored in Cloudinary.
- Résumé download is restricted to authorized administrators.
- Download URLs are temporary authenticated URLs.
12. Testing and Quality Assurance
Testing was recorded in the Test_Cases.xlsx workbook.
The test cases cover:
- Public job listing, search and job details.
- Application submission and validation.
- Missing résumé validation.
- Expired or closed job rejection.
- Duplicate application prevention.
- Administrator login and protected API access.
- Dashboard statistics.
- Job creation, editing and deletion.
- Application listing, filtering and pagination.
- Application status and notes updates.
- Résumé download.
- CSV export.
- Application tracking.
- Responsive interface.
- Production smoke testing.
Recorded Test Results
MetricResultTotal Test Cases25Passed25Failed0Pending0Not Run0
The detailed test-case workbook is included in Backend/Docs/Test_Cases.xlsx.
13. Deployment
- Frontend: Deployed on Vercel.
- Backend: Deployed on Render.
- Database: MongoDB.
- Résumé Storage: Cloudinary.
The deployed application and backend health endpoint are listed in the Live Project section.
Deployment links are also provided in Deployment_Links.txt.
14. Security Notes
- Administrator routes are protected using JWT authentication middleware.
- Administrator passwords are handled using bcrypt hashing.
- Environment variables are used for private configuration.
- Résumé downloads require administrator authorization.
- Uploaded candidate information and résumé files are treated as private data.
- Real credentials, API keys, database passwords and JWT secrets must never be committed to GitHub.
15. Known Limitations and Future Enhancements
The current implementation covers the core job portal and recruitment-management workflow.
Possible future improvements include:
- File-signature validation and malware scanning for uploaded résumés.
- Administrator activity audit logs.
- A formal data-retention and deletion policy.
- Expanded automated testing and continuous integration.
- Improved accessibility and broader browser compatibility testing.
- Optional email notifications for application confirmation and status changes.
- Advanced candidate search and job-matching functionality.
These are proposed enhancements and should not be considered completed features.
16. Project Documentation
The repository contains the following supporting documents:
DocumentLocationProject ReportProject_Report.pdfAPI DocumentationBackend/Docs/Database SchemaBackend/Docs/Database_Schema.pdfTest CasesBackend/Docs/Test_Cases.xlsxApplication ScreenshotsBackend/screenshots/Deployment LinksDeployment_Links.txtGitHub Repository LinkGitHub_Repository_Link.txt
17. Author
Nikhat Siddekee
B.Tech – Computer Science and Engineering

CareerTrack demonstrates a full-stack recruitment workflow by combining public job discovery, candidate applications, application tracking and administrator recruitment management in one web application.
