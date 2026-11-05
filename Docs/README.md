# CareerTrack -- Full-Stack Job Portal and Recruitment Management System

CareerTrack is a MERN-stack recruitment portal. Public visitors can
browse published jobs and apply without creating a candidate account.
Administrators can manage job postings and review applications.

## Live deployment

-   Frontend: https://career-track-two.vercel.app
-   Backend: https://careertrack-vvpy.onrender.com

## Technology

-   Frontend: React, Vite, React Router, Axios
-   Backend: Node.js, Express
-   Database: MongoDB, Mongoose
-   Authentication: JWT and bcrypt
-   File upload: Multer

## Features

-   Public job listing, search and details
-   Candidate application with resume upload
-   Application tracking using application ID and email
-   Admin login and protected dashboard
-   Job CRUD and publication status management
-   Application review, status updates and internal notes
-   Resume download and CSV export
-   Dashboard statistics
-   Application filters by job, status and date

## Repository structure

-   `Backend/` -- Express API, models, controllers, routes and
    middleware
-   `frontend/` -- React application
-   `postman/` -- API collections and environment files
-   `Docs/` -- project documentation
-   `Screenshots/` -- sanitized project screenshots

## Local setup

### Backend

1.  Open a terminal in `Backend/`.
2.  Run `npm install`.
3.  Create a private `.env` file using the variable names required by
    the backend source.
4.  Start the backend using the script defined in
    `Backend/package.json`.

### Frontend

1.  Open another terminal in `frontend/`.
2.  Run `npm install`.
3.  Run `npm run dev`.
4.  Open the local URL printed by Vite (usually
    `http://localhost:5173`).

## Security

-   Never commit `.env`, `node_modules`, build output, uploaded resumes
    or candidate personal data.
-   Keep admin APIs and resume downloads protected.
-   Use dummy candidate data in demos and screenshots.
-   Resume storage currently uses local disk; configure persistent/cloud
    storage before production use.

## Documentation

See `API_Documentation.pdf`, `Database_Schema.pdf`, `Test_Cases.xlsx`
and `Project_Report.pdf`. These are handover drafts; verify exact route
paths, field types and environment variable names against the final
source before formal submission.
