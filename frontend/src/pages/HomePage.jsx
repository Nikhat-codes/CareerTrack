import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Search, MapPin, Briefcase, Clock, ArrowRight } from "lucide-react";

function HomePage() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await API.get("/jobs");
        setJobs(response.data.data || []);
      } catch (error) {
        console.error("Unable to load jobs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const searchMatch =
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase()) ||
      job.skills?.some((skill) =>
        skill.toLowerCase().includes(search.toLowerCase())
      );

    const locationMatch = job.location
      ?.toLowerCase()
      .includes(location.toLowerCase());

    const typeMatch = job.employmentType
      ?.toLowerCase()
      .includes(jobType.toLowerCase());

    return searchMatch && locationMatch && typeMatch;
  });

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="home-navbar">
        <div className="home-logo">
          Career<span>Track</span>
        </div>

        <div className="home-nav-links">
          <a href="#home">Home</a>
          <a href="#jobs">Find Jobs</a>
          <a href="#about">About</a>
        </div>

        <button
          className="admin-login-link"
          onClick={() => navigate("/admin/login")}
        >
          Admin Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <span className="hero-tag">YOUR CAREER JOURNEY STARTS HERE</span>

          <h1>
            Find Your Dream
            <br />
            <span>Job Today.</span>
          </h1>

          <p>
            Discover opportunities, explore careers and connect
            with companies that match your skills.
          </p>

          <button
            className="hero-button"
            onClick={() =>
              document.getElementById("jobs")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Explore Jobs <ArrowRight size={18} />
          </button>
        </div>

        <div className="hero-illustration">
          <div className="hero-icon">💼</div>
          <div className="hero-floating-card">
            <span>✨</span>
            <div>
              <strong>New Opportunities</strong>
              <small>Your future starts here</small>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="job-search-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Job title, company or skills"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="search-box">
          <MapPin size={20} />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <select
          className="job-type-filter"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        >
          <option value="">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        <button
          className="search-button"
          onClick={() =>
            document.getElementById("jobs")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          Search
        </button>
      </section>

      {/* Jobs Section */}
      <section className="jobs-section" id="jobs">
        <div className="jobs-heading">
          <div>
            <span className="section-tag">CAREER OPPORTUNITIES</span>
            <h2>Latest Job Openings</h2>
            <p>Explore opportunities that match your career goals.</p>
          </div>

          <span className="job-count">
            {filteredJobs.length} Jobs Found
          </span>
        </div>

        {loading ? (
          <p className="jobs-message">Loading jobs...</p>
        ) : filteredJobs.length === 0 ? (
          <div className="jobs-message">
            <h3>No jobs found</h3>
            <p>Try changing your search or filters.</p>
          </div>
        ) : (
          <div className="job-cards-grid">
            {filteredJobs.map((job) => (
              <div className="job-card" key={job._id}>
                <div className="job-card-top">
                  <div className="company-icon">🏢</div>
                  <span className="job-badge">
                    {job.workMode || "On-site"}
                  </span>
                </div>

                <h3>{job.title}</h3>
                <p className="company-name">{job.company}</p>

                <div className="job-information">
                  <span>
                    <MapPin size={15} /> {job.location}
                  </span>

                  <span>
                    <Briefcase size={15} /> {job.employmentType}
                  </span>

                  {job.salary && (
                    <span>💰 {job.salary}</span>
                  )}
                </div>

                <p className="job-summary">
                  {job.summary || "Explore this exciting career opportunity."}
                </p>

                <div className="job-card-bottom">
                  <span>
                    <Clock size={14} /> Open Position
                  </span>

                  <button
                    onClick={() =>
                      navigate(`/jobs/${job._id}`)
                    }
                  >
                    View Details <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <h2>Build Your Future With CareerTrack</h2>
        <p>
          We help job seekers discover opportunities and take
          the next step in their professional journey.
        </p>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <h2>CareerTrack</h2>
        <p>Connecting talent with opportunities.</p>
        <span>© 2026 CareerTrack. All rights reserved.</span>
      </footer>
    </div>
  );
}

export default HomePage;