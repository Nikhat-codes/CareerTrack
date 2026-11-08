# CareerTrack – Full-Stack Job Portal & Recruitment Management System

CareerTrack is a full-stack job portal and recruitment management system developed using the MERN stack. It connects job seekers with employment opportunities and provides administrators with tools to manage job postings and candidate applications.

The platform allows candidates to browse available jobs and submit applications without creating an account. Administrators can securely manage job listings, review applications, update application statuses, and monitor recruitment activities through an admin dashboard.

---

## 🚀 Live Demo

- **Frontend:** https://career-track-two.vercel.app
- **Backend API:** https://careertrack-vvpy.onrender.com
- **GitHub Repository:** https://github.com/Nikhat-codes/CareerTrack

---

## ✨ Key Features

### 1. Public Job Portal
- Browse available job opportunities.
- Search jobs by title, company, and location.
- Filter job listings.
- View detailed job descriptions.
- Responsive user interface.

### 2. Candidate Application System
- Apply for jobs without registration.
- Submit personal and educational details.
- Upload resumes in supported formats.
- Form validation.
- Application submission confirmation.
- Duplicate application prevention.

### 3. Admin Authentication
- Secure administrator login.
- Protected administrative routes.
- Authentication and authorization.

### 4. Admin Dashboard
- View total jobs.
- Monitor active and expired jobs.
- View total applications.
- Manage job postings.
- Create, edit, and manage job listings.

### 5. Application Management
- View candidate applications.
- Filter applications by job and date.
- Update application status.
- Add internal recruitment notes.
- Download candidate resumes.
- Export application records to CSV.

### 6. Responsive Design
- Desktop-friendly interface.
- Mobile-responsive layouts.
- Easy navigation and user-friendly design.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| HTML5 | Page structure |
| CSS3 | Styling and responsive design |
| JavaScript | Application functionality |
| Node.js | Backend runtime |
| Express.js | Backend API development |
| MongoDB | Database |
| REST API | Frontend-backend communication |
| Git & GitHub | Version control |
| Vercel | Frontend deployment |
| Render | Backend deployment |
| Postman | API testing |

---

## 📂 Project Structure

```text
CareerTrack/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── Docs/
│   ├── API_Documentation.pdf
│   ├── Database_Schema.pdf
│   ├── Project_Report.pdf
│   ├── README.md
│   └── Test_Cases.xlsx
│
├── Screenshots/
│   └── CareerTrack_Screenshots/
│
├── postman/
│
├── .gitignore
└── README.md
```

---

## 📸 Application Screenshots

The screenshots folder contains visual evidence of the implemented application, including:

- Homepage
- Job search and filters
- Job listings
- Job details
- Candidate application form
- Application submission confirmation
- Admin login
- Admin dashboard
- Job management
- Application management
- Job and date filters
- Internal notes
- Application status updates
- Resume download
- CSV export
- Validation messages
- Mobile interface

**Screenshots Location:** `Screenshots/CareerTrack_Screenshots/`

---

## 📚 Project Documentation

All major project documentation is available in the `Docs` folder.

| Document | Description |
|---|---|
| [Project Report](Docs/Project_Report.pdf) | Complete project documentation |
| [API Documentation](Docs/API_Documentation.pdf) | API endpoints and functionality |
| [Database Schema](Docs/Database_Schema.pdf) | Database structure and relationships |
| [Test Cases](Docs/Test_Cases.xlsx) | Testing scenarios and results |

---

## ⚙️ Installation and Setup

### Prerequisites

- Node.js
- npm
- MongoDB
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Nikhat-codes/CareerTrack.git
```

```bash
cd CareerTrack
```

### 2. Setup Frontend

```bash
cd frontend
npm install
```

Configure the frontend environment variable for the backend API URL as required by the application.

Start the development server using the script configured in `frontend/package.json`.

### 3. Setup Backend

Open another terminal:

```bash
cd Backend
npm install
```

Configure the required environment variables using the backend environment configuration.

Start the backend using the script configured in `Backend/package.json`.

**Note:** Actual environment variable names and run scripts should be taken from the project configuration. Do not publish database credentials, passwords, API keys, or private tokens.

---

## 🧪 Testing

The application has been tested for the following functionalities:

- Homepage and job listings.
- Job search and filters.
- Job details.
- Candidate application submission.
- Resume upload and download.
- Duplicate application prevention.
- Administrator authentication.
- Job creation and management.
- Application management.
- Job and date filters.
- Internal notes.
- Application status updates.
- CSV export.
- Form validation.
- Responsive mobile interface.

Detailed test cases and results are available in:

`Docs/Test_Cases.xlsx`

---

## 🔮 Future Enhancements

- Candidate registration and personalized accounts.
- Email notifications.
- Advanced analytics.
- Improved recruitment automation.
- Additional search and filtering options.

---

## 👩‍💻 Developer

**Nikhat Siddekee**

B.Tech – Computer Science and Engineering

GitHub: [Nikhat-codes](https://github.com/Nikhat-codes)

---

## 📄 License

This project was developed as an academic major project for practical learning and demonstration of full-stack web development concepts.
