# CareerTrack – Full-Stack Job Portal & Recruitment Management System

CareerTrack is a MERN-stack job portal that connects job seekers with employers through a public job application portal and an administrator dashboard.

Visitors can explore published job openings, view job details, and submit applications with a résumé without creating a candidate account. Administrators can manage job postings and review candidate applications through a secure dashboard.

---

## 1. Live Project

| Resource | Link |
|---|---|
| Frontend | https://career-track-two.vercel.app |
| Backend API | https://careertrack-vvpy.onrender.com |
| Backend Health Check | https://careertrack-vvpy.onrender.com/api/health |
| GitHub Repository | https://github.com/Nikhat-codes/CareerTrack |

> **Note:** The backend is hosted on Render's free service. It may take a short time to respond after a period of inactivity.

## 2. Project Objectives

- Develop a full-stack recruitment management platform.
- Allow visitors to browse and search published job openings.
- Enable candidates to apply without creating an account.
- Provide secure administrator authentication.
- Allow administrators to manage jobs and applications.
- Provide application tracking using an application ID and email address.
- Store uploaded résumés in Cloudinary.

## 3. Main Features

### Public Job Portal

- View published job openings.
- Search and browse available jobs.
- View individual job details.
- Submit applications without candidate registration.
- Upload a résumé with an application.
- Track application progress using an application ID and email.
- View application submission confirmation.

### Candidate Application Module

- Collect candidate name, email, phone number, and education details.
- Accept experience, skills, and cover letter information.
- Support PDF, DOC, and DOCX résumé uploads.
- Validate required fields and résumé file requirements.
- Prevent duplicate applications for the same job and email combination.
- Reject applications for unavailable or expired jobs.

### Admin Dashboard

- Administrator login and protected dashboard access.
- View dashboard statistics.
- Create, update, and manage job postings.
- Control job publication status.
- View and manage candidate applications.
- Filter applications by job, status, and date.
- Update application status and add internal recruitment notes.
- Download candidate résumés.
- Export application records as CSV.

### Application Status Workflow

Applications can move through the following statuses:

1. Submitted
2. Under Review
3. Shortlisted
4. Interview Scheduled
5. Selected
6. Rejected

## 4. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Routing | React Router |
| API communication | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Token (JWT), bcrypt |
| File upload | Multer |
| Cloud storage | Cloudinary |
| API testing | Postman |
| Version control | Git, GitHub |
| Frontend deployment | Vercel |
| Backend deployment | Render |

## 5. System Architecture

CareerTrack follows a client-server architecture:

1. The React frontend provides the public portal and administrator interface.
2. Axios sends HTTP requests to the Express REST API.
3. Express routes direct requests to the appropriate controllers.
4. Middleware handles administrator authentication and résumé upload processing.
5. Mongoose models communicate with MongoDB.
6. The backend uploads résumé files to Cloudinary.
7. The backend returns responses to the frontend.

### Main Database Models

- **Job:** Stores job details, requirements, and publication status.
- **Application:** Stores candidate application details, résumé metadata, application status, and internal notes.
- **Admin:** Stores administrator account information.

## 6. Repository Structure

The following is a summary of the main folders and files in the repository.

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
│   │   ├── Job_Details.png
│   │   ├── admin_dashboard.png
│   │   ├── application_Form1.png
│   │   ├── application_form2.png
│   │   ├── application_management.png
│   │   └── public_portal.png
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env.example
│   ├── .gitignore
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
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
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vercel.json
│   └── vite.config.js
├── postman/
├── .gitignore
├── Deployment_Links.txt
├── GitHub_Repository_Link.txt
├── Project_Report.pdf
└── README.md
```

> The tree above highlights the main project structure. Refer to the repository for the complete list of source files and utility scripts.

## 7. Prerequisites

Install the following before running the project locally:

- Node.js and npm
- MongoDB database or MongoDB Atlas account
- Git
- Visual Studio Code or another code editor
- Postman (for API testing)

## 8. Run the Project Locally

### Step 1: Clone the repository

```bash
git clone https://github.com/Nikhat-codes/CareerTrack.git
cd CareerTrack
```

### Step 2: Set up the backend

Open a terminal and run:

```bash
cd Backend
npm install
```

Create a private `.env` file in the `Backend` folder using `Backend/.env.example` as a template. Configure the following variables with your own values:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_NAME=your_admin_name
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Use your actual MongoDB, JWT, administrator, and Cloudinary values in the private `.env` file. Keep these credentials secret and never commit `.env` to GitHub.

Start the backend development server:

```bash
npm run dev
```

For production mode, use `npm start`.

### Step 3: Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create a private `.env` file in the `frontend` folder using `frontend/.env.example` as a template. For local development, set the backend API URL to:

```env
VITE_API_URL=http://localhost:5000/api
```

The deployed frontend uses the production backend URL configured in its deployment environment:

```env
VITE_API_URL=https://careertrack-vvpy.onrender.com/api
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

## 9. Database Configuration

CareerTrack uses MongoDB for persistent data storage and Mongoose for schema definition and database operations.

The main collections are:

- Jobs
- Applications
- Admins

The database connection is configured through backend environment variables. The Application model uses a unique compound index on job and email to prevent duplicate applications for the same job.

Refer to `Backend/Docs/Database_Schema.pdf` for the database structure, important fields, relationships, and indexes.

## 10. API Documentation

The backend provides REST API endpoints under the `/api` base path.

| Endpoint group | Purpose |
|---|---|
| `/api/jobs` | Public job listing and job details |
| `/api/applications` | Application submission, tracking, and management |
| `/api/auth` | Administrator authentication |
| `/api/admin/jobs` | Administrator job management |
| `/api/dashboard` | Dashboard statistics |

Protected administrator endpoints require a valid JWT bearer token.

Refer to the API documentation PDF in `Backend/Docs/` for HTTP methods, endpoint paths, access requirements, and descriptions.

## 11. File Upload and Storage

- Résumé uploads are processed using Multer memory storage.
- Accepted formats are PDF, DOC, and DOCX.
- Maximum permitted file size is 5 MB.
- Uploaded résumé files are stored in Cloudinary.
- Résumé downloads require administrator authorization.
- Download URLs are temporary authenticated URLs.

## 12. Testing and Quality Assurance

Testing was recorded in `Backend/Docs/Test_Cases.xlsx`.

The test cases cover:

- Public job listing, search, and job details.
- Application submission and validation.
- Missing résumé validation.
- Expired or closed job rejection.
- Duplicate application prevention.
- Administrator login and protected API access.
- Dashboard statistics.
- Job creation, editing, and deletion.
- Application listing, filtering, and pagination.
- Application status and notes updates.
- Résumé download and CSV export.
- Application tracking.
- Responsive interface and production smoke testing.

### Recorded Test Results

| Metric | Result |
|---|---:|
| Total test cases | 25 |
| Passed | 25 |
| Failed | 0 |
| Pending | 0 |
| Not run | 0 |

The detailed test-case workbook is included in `Backend/Docs/Test_Cases.xlsx`.

## 13. Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB
- **Résumé storage:** Cloudinary

The deployed application and backend health endpoint are listed in the Live Project section. Deployment links are also provided in `Deployment_Links.txt`.

## 14. Security Notes

- Administrator routes are protected using JWT authentication middleware.
- Administrator passwords are handled using bcrypt hashing.
- Environment variables are used for private configuration.
- Résumé downloads require administrator authorization.
- Candidate information and résumé files are treated as private data.
- Never commit real credentials, API keys, database passwords, or JWT secrets to GitHub.

## 15. Known Limitations and Future Enhancements

The current implementation covers the core job portal and recruitment-management workflow. Possible future improvements include:

- File-signature validation and malware scanning for uploaded résumés.
- Administrator activity audit logs.
- A formal data-retention and deletion policy.
- Expanded automated testing and continuous integration.
- Improved accessibility and broader browser compatibility testing.
- Optional email notifications for application confirmation and status changes.
- Advanced candidate search and job-matching functionality.

These are proposed enhancements and are not represented as completed features.

## 16. Project Documentation

| Document | Repository location |
|---|---|
| Project report | `Project_Report.pdf` |
| API documentation | `Backend/Docs/` |
| Database schema | `Backend/Docs/Database_Schema.pdf` |
| Test cases | `Backend/Docs/Test_Cases.xlsx` |
| Application screenshots | `Backend/screenshots/` |
| Deployment links | `Deployment_Links.txt` |
| GitHub repository link | `GitHub_Repository_Link.txt` |

## 17. Author

**Nikhat Siddekee**  
B.Tech – Computer Science and Engineering

---

CareerTrack combines public job discovery, candidate applications, application tracking, and administrator recruitment management in one web application.
