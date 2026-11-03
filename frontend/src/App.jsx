import { useEffect, useMemo, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import API from "./services/api";
import AdminLogin from "./pages/AdminLogin";
import AdminJobs from "./pages/AdminJobs";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";
import AdminApplications from "./pages/AdminApplications";
import TrackApplication from "./pages/TrackApplication";
function formatDate(date) {
  if (!date) return "Recently posted";

  const postedDate = new Date(date);

  if (Number.isNaN(postedDate.getTime())) {
    return "Recently posted";
  }

  return postedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ApplicationForm({ job, onClose }) {
  const [message, setMessage] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const resume = form.elements.resume.files[0];

    if (!resume) {
      setResumeError("Please attach your résumé.");
      return;
    }

    const allowedExtension = /\.(pdf|doc|docx)$/i.test(resume.name);
    const maxSize = 5 * 1024 * 1024;

    if (!allowedExtension) {
      setResumeError("Upload PDF, DOC or DOCX file only.");
      return;
    }

    if (resume.size > maxSize) {
      setResumeError("The résumé must be 5 MB or smaller.");
      return;
    }

    setResumeError("");
    setMessage("");
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("jobId", job._id);
      formData.append(
        "candidateName",
        form.elements.name.value.trim()
      );
      formData.append("email", form.elements.email.value.trim());
      formData.append("phone", form.elements.phone.value.trim());
      formData.append("education", form.elements.education.value.trim());
      formData.append(
        "experience",
        form.elements.experience.value.trim()
      );
      formData.append("skills", form.elements.skills.value.trim());
      formData.append(
        "coverLetter",
        form.elements.coverLetter.value.trim()
      );
      formData.append("resume", resume);

      const response = await API.post("/applications", formData);

      setMessage(
        response.data.message || "Application submitted successfully!"
      );

      form.reset();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Application could not be submitted. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
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
            <input
              name="name"
              type="text"
              required
              placeholder="Your name"
            />
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
            Experience
            <textarea
              name="experience"
              rows="3"
              placeholder="Describe your experience"
            />
          </label>

          <label>
            Skills
            <textarea
              name="skills"
              rows="3"
              placeholder="React, JavaScript, HTML, CSS..."
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
            Résumé (PDF, DOC or DOCX, up to 5 MB)
            <input
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={() => setResumeError("")}
              required
            />
          </label>

          {resumeError && (
            <p className="form-error">{resumeError}</p>
          )}

          {message && (
            <p className="form-notice">{message}</p>
          )}

          <button
            className="button button-primary button-full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit application"}
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
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <p className="eyebrow">OPEN OPPORTUNITY</p>

        <h2 id="job-detail-title">{job.title}</h2>

        <p className="modal-intro">
          {job.company} · {job.location}
        </p>

        <div className="detail-facts">
          <span>{job.employmentType}</span>
          <span>{job.workMode || "On-site"}</span>
          <span>{job.salary || "Not specified"}</span>
        </div>

        <h3>About the role</h3>
        <p>{job.description}</p>

        {job.responsibilities?.length > 0 && (
          <>
            <h3>Responsibilities</h3>
            <ul>
              {job.responsibilities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </>
        )}

        {job.qualifications?.length > 0 && (
          <>
            <h3>Qualifications</h3>
            <ul>
              {job.qualifications.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </>
        )}

        {job.skills?.length > 0 && (
          <>
            <h3>Skills</h3>
            <div className="skill-list">
              {job.skills.map((skill, index) => (
                <span className="skill-tag" key={index}>
                  {skill}
                </span>
              ))}
            </div>
          </>
        )}

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

function HomePage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("All types");
  const [sortOrder, setSortOrder] = useState("Newest");

  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationJob, setApplicationJob] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/jobs", {
          params: {
            limit: 50,
          },
        });

        setJobs(response.data.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load jobs. Please check your backend server."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    const locationTerm = location.trim().toLowerCase();

    return jobs
      .filter((job) => {
        const matchesSearch =
          !searchTerm ||
          `${job.title} ${job.company} ${job.summary} ${(
            job.skills || []
          ).join(" ")}`
            .toLowerCase()
            .includes(searchTerm);

        const matchesLocation =
          !locationTerm ||
          job.location?.toLowerCase().includes(locationTerm);

        const matchesType =
          employmentType === "All types" ||
          job.employmentType === employmentType;

        return matchesSearch && matchesLocation && matchesType;
      })
      .sort((a, b) => {
        if (sortOrder === "Company A–Z") {
          return a.company.localeCompare(b.company);
        }

        return (
          new Date(b.publishedAt || b.createdAt) -
          new Date(a.publishedAt || a.createdAt)
        );
      });
  }, [jobs, search, location, employmentType, sortOrder]);

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
          onClick={() => navigate("/admin/login")}
        >
          Admin login
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow hero-eyebrow">
              YOUR NEXT CHAPTER STARTS HERE
            </p>

            <h1>Find work that moves you forward.</h1>

            <p className="hero-copy">
              Explore opportunities from teams building what comes next.
              Search by role, company, or location.
            </p>

            <form
              className="search-panel"
              onSubmit={(event) => event.preventDefault()}
            >
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
            <span>open opportunities</span>
          </div>

          <div>
            <strong>
              {new Set(jobs.map((job) => job.company)).size}
            </strong>
            <span>hiring companies</span>
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
              <p>
                Find a role that fits your skills and where you want to go.
              </p>
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
                onChange={(event) =>
                  setEmploymentType(event.target.value)
                }
              >
                <option>All types</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
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

          {loading ? (
            <div className="empty-state">
              <h3>Loading opportunities...</h3>
              <p>Please wait while we fetch the latest jobs.</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button
                className="button button-outline"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="job-grid">
              {filteredJobs.map((job) => (
                <article className="job-card" key={job._id}>
                  <div className="job-card-top">
                    <span className="company-avatar">
                      {job.company?.charAt(0) || "C"}
                    </span>

                    <span className="job-type">
                      {job.employmentType}
                    </span>
                  </div>

                  <p className="job-company">{job.company}</p>

                  <h3>{job.title}</h3>

                  <p className="job-description">
                    {job.summary || job.description}
                  </p>

                  <div className="job-meta">
                    <span>{job.location}</span>
                    <span>{job.workMode || "On-site"}</span>
                  </div>

                  <div className="job-card-bottom">
                    <div>
                      <strong>{job.salary || "Not specified"}</strong>
                      <span>{formatDate(job.publishedAt || job.createdAt)}</span>
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
            CareerTrack brings job opportunities and application progress
            into one simple place. This portal is designed for candidates
            and recruitment teams.
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

function App() {
  return (
   <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/admin/login" element={<AdminLogin />} />

  <Route
    path="/admin/dashboard"
    element={<AdminDashboard />}
  />

  <Route path="/admin/jobs" element={<AdminJobs />} />

  <Route
    path="/admin/applications"
    element={<AdminApplications />}
  />

  <Route
    path="/track-application"
    element={<TrackApplication />}
  />
</Routes> 
    
  );
}

export default App;
