import { useMemo, useState } from "react";
import "./App.css";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "BrightLayer Technologies",
    location: "Remote",
    type: "Full-time",
    experience: "1–3 years",
    salary: "₹5–8 LPA",
    posted: "2 days ago",
    category: "Engineering",
    description:
      "Build accessible, responsive web experiences and work closely with design and product teams.",
    skills: ["React", "JavaScript", "CSS", "REST APIs"],
    responsibilities: [
      "Develop responsive user interfaces using React.",
      "Work with designers to turn product ideas into polished experiences.",
      "Review code and help improve frontend quality."
    ]
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "Northstar Digital",
    location: "Bengaluru, Karnataka",
    type: "Full-time",
    experience: "2–4 years",
    salary: "₹8–12 LPA",
    posted: "1 day ago",
    category: "Engineering",
    description:
      "Create reliable APIs and services for products used by growing teams.",
    skills: ["Node.js", "Express", "MongoDB", "REST APIs"],
    responsibilities: [
      "Design and maintain REST API endpoints.",
      "Work with MongoDB schemas and data validation.",
      "Improve reliability, security, and performance."
    ]
  },
  {
    id: 3,
    title: "Product Designer",
    company: "Form & Function",
    location: "Mumbai, Maharashtra",
    type: "Full-time",
    experience: "2–5 years",
    salary: "₹7–11 LPA",
    posted: "3 days ago",
    category: "Design",
    description:
      "Help make complex workflows feel clear and useful through thoughtful product design.",
    skills: ["Figma", "Prototyping", "Design Systems", "Research"],
    responsibilities: [
      "Create user flows, wireframes, and prototypes.",
      "Partner with product and engineering teams.",
      "Use research and feedback to improve designs."
    ]
  },
  {
    id: 4,
    title: "Junior Data Analyst",
    company: "Cedar Analytics",
    location: "Pune, Maharashtra",
    type: "Full-time",
    experience: "0–2 years",
    salary: "₹4–6 LPA",
    posted: "5 days ago",
    category: "Data",
    description:
      "Turn business data into clear reports and insights that support better decisions.",
    skills: ["SQL", "Excel", "Power BI", "Communication"],
    responsibilities: [
      "Prepare and check datasets for reporting.",
      "Build clear dashboards and recurring reports.",
      "Explain findings to non-technical teams."
    ]
  },
  {
    id: 5,
    title: "QA Engineer",
    company: "OrbitWorks",
    location: "Hyderabad, Telangana",
    type: "Contract",
    experience: "1–3 years",
    salary: "₹5–7 LPA",
    posted: "4 days ago",
    category: "Engineering",
    description:
      "Help deliver dependable software by testing features and reporting issues clearly.",
    skills: ["Manual Testing", "API Testing", "Postman", "SQL"],
    responsibilities: [
      "Write and run test cases for product features.",
      "Report bugs with clear reproduction steps.",
      "Work with developers to verify fixes."
    ]
  },
  {
    id: 6,
    title: "Marketing Associate",
    company: "Goodwell Studio",
    location: "Delhi, India",
    type: "Part-time",
    experience: "0–2 years",
    salary: "₹3–5 LPA",
    posted: "1 week ago",
    category: "Marketing",
    description:
      "Support campaigns, research audiences, and help share useful stories about the product.",
    skills: ["Content", "Social Media", "Research", "Analytics"],
    responsibilities: [
      "Help plan and publish marketing content.",
      "Track campaign performance and summarize results.",
      "Research audiences and market trends."
    ]
  }
];

function ApplicationForm({ job, onClose }) {
  const [message, setMessage] = useState("");
  const [resumeError, setResumeError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const resume = form.elements.resume.files[0];

    if (!resume) {
      setResumeError("Please attach your résumé.");
      return;
    }

    const allowedExtension = /\.(pdf|docx)$/i.test(resume.name);
    const maxSize = 5 * 1024 * 1024;

    if (!allowedExtension) {
      setResumeError("Upload your résumé as a PDF or DOCX file.");
      return;
    }

    if (resume.size > maxSize) {
      setResumeError("The résumé must be 5 MB or smaller.");
      return;
    }

    setResumeError("");
    setMessage(
      "The form looks good. Application sending and secure storage will be connected when the backend is added."
    );
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="modal application-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <p className="eyebrow">CAREERTRACK APPLICATION</p>
        <h2 id="application-title">Apply for {job.title}</h2>
        <p className="modal-intro">
          Applying to {job.company}. No account is needed.
        </p>

        <form className="application-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input name="name" type="text" required placeholder="Your name" />
          </label>

          <div className="form-row">
            <label>
              Email address
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </label>
            <label>
              Phone number
              <input
                name="phone"
                type="tel"
                required
                pattern="[0-9+() -]{7,20}"
                placeholder="+91 98765 43210"
              />
            </label>
          </div>

          <label>
            Education
            <input
              name="education"
              type="text"
              required
              placeholder="Degree, course, or qualification"
            />
          </label>

          <label>
            Experience and skills
            <textarea
              name="experience"
              required
              rows="3"
              placeholder="Briefly describe your experience and relevant skills"
            />
          </label>

          <label>
            Cover letter
            <textarea
              name="coverLetter"
              rows="4"
              placeholder="Why are you interested in this role?"
            />
          </label>

          <label>
            Résumé (PDF or DOCX, up to 5 MB)
            <input
              name="resume"
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={() => setResumeError("")}
            />
          </label>

          {resumeError && <p className="form-error">{resumeError}</p>}
          {message && <p className="form-notice">{message}</p>}

          <button className="button button-primary button-full" type="submit">
            Review application
          </button>
        </form>
      </section>
    </div>
  );
}

function JobDetails({ job, onClose, onApply }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-detail-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <p className="eyebrow">{job.category} ROLE</p>
        <h2 id="job-detail-title">{job.title}</h2>
        <p className="modal-intro">
          {job.company} · {job.location}
        </p>

        <div className="detail-facts">
          <span>{job.type}</span>
          <span>{job.experience}</span>
          <span>{job.salary}</span>
        </div>

        <h3>About the role</h3>
        <p>{job.description}</p>

        <h3>Responsibilities</h3>
        <ul>
          {job.responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3>Skills</h3>
        <div className="skill-list">
          {job.skills.map((skill) => (
            <span className="skill-tag" key={skill}>
              {skill}
            </span>
          ))}
        </div>

        <button
          className="button button-primary button-full modal-apply"
          onClick={onApply}
        >
          Apply for this job
        </button>
      </section>
    </div>
  );
}

function App() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("All types");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationJob, setApplicationJob] = useState(null);

  const filteredJobs = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    const locationTerm = location.trim().toLowerCase();

    return jobs
      .filter((job) => {
        const matchesSearch =
          !searchTerm ||
          `${job.title} ${job.company} ${job.category}`
            .toLowerCase()
            .includes(searchTerm);

        const matchesLocation =
          !locationTerm || job.location.toLowerCase().includes(locationTerm);

        const matchesType =
          employmentType === "All types" || job.type === employmentType;

        return matchesSearch && matchesLocation && matchesType;
      })
      .sort((a, b) => {
        if (sortOrder === "Company A–Z") {
          return a.company.localeCompare(b.company);
        }
        return a.id - b.id;
      });
  }, [search, location, employmentType, sortOrder]);

  function openApplication(job) {
    setSelectedJob(null);
    setApplicationJob(job);
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="CareerTrack home">
          <span className="brand-mark">C</span>
          <span>
            Career<span>Track</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Main navigation">
          <a href="#jobs">Find jobs</a>
          <a href="#about">About</a>
        </nav>

        <button
          className="button button-outline admin-button"
          onClick={() =>
            alert("The secure administrator login will be added in a later step.")
          }
        >
          Admin login
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow hero-eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
            <h1>Find work that moves you forward.</h1>
            <p className="hero-copy">
              Explore opportunities from teams building what comes next.
              Search by role, company, or location.
            </p>

            <form className="search-panel" onSubmit={(event) => event.preventDefault()}>
              <label>
                <span>What are you looking for?</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Job title, company, or skill"
                />
              </label>
              <label>
                <span>Where?</span>
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="City or remote"
                />
              </label>
              <button className="button button-primary" type="submit">
                Search jobs
              </button>
            </form>

            <p className="hero-note">
              Browse jobs and apply without creating an account.
            </p>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-card">
              <span className="art-card-label">A good next step</span>
              <strong>Find your kind of work.</strong>
              <span className="art-card-line" />
              <span className="art-card-line short" />
              <span className="art-card-pill">Open opportunities</span>
            </div>
            <span className="art-star star-one">✦</span>
            <span className="art-star star-two">✦</span>
          </div>
        </section>

        <section className="quick-stats" aria-label="Job search summary">
          <div>
            <strong>{jobs.length}</strong>
            <span>sample opportunities</span>
          </div>
          <div>
            <strong>4</strong>
            <span>career areas</span>
          </div>
          <div>
            <strong>1 click</strong>
            <span>to explore a role</span>
          </div>
        </section>

        <section className="jobs-section" id="jobs">
          <div className="section-heading">
            <div>
              <p className="eyebrow">OPPORTUNITIES</p>
              <h2>Explore open roles</h2>
              <p>Find a role that fits your skills and where you want to go.</p>
            </div>
            <span className="result-count">
              {filteredJobs.length}{" "}
              {filteredJobs.length === 1 ? "role" : "roles"} found
            </span>
          </div>

          <div className="job-toolbar">
            <label>
              Employment type
              <select
                value={employmentType}
                onChange={(event) => setEmploymentType(event.target.value)}
              >
                <option>All types</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
              </select>
            </label>

            <label>
              Sort by
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
              >
                <option>Newest</option>
                <option>Company A–Z</option>
              </select>
            </label>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="job-grid">
              {filteredJobs.map((job) => (
                <article className="job-card" key={job.id}>
                  <div className="job-card-top">
                    <span className="company-avatar">
                      {job.company.charAt(0)}
                    </span>
                    <span className="job-type">{job.type}</span>
                  </div>

                  <p className="job-company">{job.company}</p>
                  <h3>{job.title}</h3>
                  <p className="job-description">{job.description}</p>

                  <div className="job-meta">
                    <span>{job.location}</span>
                    <span>{job.experience}</span>
                  </div>

                  <div className="job-card-bottom">
                    <div>
                      <strong>{job.salary}</strong>
                      <span>{job.posted}</span>
                    </div>
                    <button
                      className="button button-small button-outline"
                      onClick={() => setSelectedJob(job)}
                    >
                      View details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">⌕</span>
              <h3>No matching roles yet</h3>
              <p>Try another title, location, or employment type.</p>
              <button
                className="button button-outline"
                onClick={() => {
                  setSearch("");
                  setLocation("");
                  setEmploymentType("All types");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="about-strip" id="about">
          <div>
            <p className="eyebrow">ABOUT CAREERTRACK</p>
            <h2>A clearer path from discovery to application.</h2>
          </div>
          <p>
            CareerTrack brings job opportunities and application progress into
            one simple place. This portal is designed for candidates and
            recruitment teams.
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark">C</span>
          <span>
            Career<span>Track</span>
          </span>
        </a>
        <span>Opportunities for what comes next.</span>
      </footer>

      {selectedJob && (
        <JobDetails
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={() => openApplication(selectedJob)}
        />
      )}

      {applicationJob && (
        <ApplicationForm
          job={applicationJob}
          onClose={() => setApplicationJob(null)}
        />
      )}
    </div>
  );
}

export default App;