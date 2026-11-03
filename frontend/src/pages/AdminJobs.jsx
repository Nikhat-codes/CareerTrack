import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const emptyForm = {
  title: "",
  company: "",
  location: "",
  workMode: "On-site",
  employmentType: "Full-time",
  salary: "",
  experience: "",
  summary: "",
  description: "",
  responsibilities: "",
  qualifications: "",
  skills: "",
  benefits: "",
  applicationInstructions: "",
  status: "draft",
  expiresAt: "",
};

function AdminJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("adminToken");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/admin/jobs",
        authConfig
      );

      setJobs(response.data.data || []);
    } catch (err) {
      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      setError(
        err.response?.data?.message ||
        "Unable to load jobs."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
    setShowForm(true);
  }

  function openEditForm(job) {
    setEditingId(job._id);

    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      workMode: job.workMode || "On-site",
      employmentType: job.employmentType || "Full-time",
      salary: job.salary || "",
      experience: job.experience || "",
      summary: job.summary || "",
      description: job.description || "",
      responsibilities: (job.responsibilities || []).join("\n"),
      qualifications: (job.qualifications || []).join("\n"),
      skills: (job.skills || []).join(", "),
      benefits: (job.benefits || []).join("\n"),
      applicationInstructions: job.applicationInstructions || "",
      status: job.status || "draft",
      expiresAt: job.expiresAt
        ? new Date(job.expiresAt).toISOString().slice(0, 10)
        : "",
    });

    setMessage("");
    setError("");
    setShowForm(true);
  }

  function convertList(value, separator = "\n") {
    return value
      .split(separator)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      ...form,
      responsibilities: convertList(form.responsibilities),
      qualifications: convertList(form.qualifications),
      skills: convertList(form.skills, ","),
      benefits: convertList(form.benefits),
      expiresAt: form.expiresAt || null,
    };

    try {
      if (editingId) {
        await API.put(
          `/admin/jobs/${editingId}`,
          payload,
          authConfig
        );

        setMessage("Job updated successfully!");
      } else {
        await API.post(
          "/admin/jobs",
          payload,
          authConfig
        );

        setMessage("Job created successfully!");
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);

      await fetchJobs();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save job. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) return;

    try {
      await API.delete(
        `/admin/jobs/${id}`,
        authConfig
      );

      setMessage("Job deleted successfully!");
      await fetchJobs();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete job."
      );
    }
  }

  async function handleStatusChange(job) {
    const newStatus =
      job.status === "published" ? "closed" : "published";

    try {
      await API.put(
        `/admin/jobs/${job._id}`,
        { status: newStatus },
        authConfig
      );

      setMessage(`Job ${newStatus} successfully!`);
      await fetchJobs();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update job status."
      );
    }
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  }

  return (
    <div className="admin-dashboard">

      <aside className="dashboard-sidebar">
        <h2>CareerTrack</h2>
        <p>ADMIN PANEL</p>

        <button onClick={() => navigate("/admin/dashboard")}>
          📊 Dashboard
        </button>

        <button className="active">
          💼 Manage Jobs
        </button>

        <button onClick={() => navigate("/admin/applications")}>
          📄 Applications
        </button>

        <button className="logout-button" onClick={handleLogout}>
          ↪ Logout
        </button>
      </aside>

      <main className="dashboard-main">

        <header className="dashboard-header">
          <div>
            <p>CAREERTRACK ADMIN</p>
            <h1>Manage Jobs</h1>
            <span>Create, edit and manage job opportunities.</span>
          </div>

          <div className="admin-avatar">A</div>
        </header>

        <div className="jobs-admin-toolbar">
          <div>
            <h2>All Job Postings</h2>
            <p>{jobs.length} jobs found</p>
          </div>

          <button
            className="button button-primary"
            onClick={openAddForm}
          >
            + Add New Job
          </button>
        </div>

        {message && (
          <p className="dashboard-success">{message}</p>
        )}

        {error && (
          <p className="dashboard-error">{error}</p>
        )}

        {showForm && (
          <section className="job-editor">

            <h2>
              {editingId ? "Edit Job" : "Create New Job"}
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="job-form-grid">

                <label>
                  Job Title *
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Company Name *
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Location *
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Work Mode
                  <select
                    name="workMode"
                    value={form.workMode}
                    onChange={handleChange}
                  >
                    <option>On-site</option>
                    <option>Hybrid</option>
                    <option>Remote</option>
                  </select>
                </label>

                <label>
                  Employment Type
                  <select
                    name="employmentType"
                    value={form.employmentType}
                    onChange={handleChange}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </label>

                <label>
                  Salary
                  <input
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    placeholder="e.g. ₹4-6 LPA"
                  />
                </label>

                {/* NEW FIELD: EXPERIENCE */}

                <label>
                  Experience Required
                  <input
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="e.g. Fresher / 0-2 years"
                  />
                </label>

                <label>
                  Job Status
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>

                <label>
                  Expiry Date
                  <input
                    type="date"
                    name="expiresAt"
                    value={form.expiresAt}
                    onChange={handleChange}
                  />
                </label>

              </div>

              <label>
                Job Summary *
                <textarea
                  name="summary"
                  value={form.summary}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </label>

              <label>
                Job Description *
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  required
                />
              </label>

              <label>
                Responsibilities
                <textarea
                  name="responsibilities"
                  value={form.responsibilities}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter each responsibility on a new line"
                />
              </label>

              <label>
                Qualifications
                <textarea
                  name="qualifications"
                  value={form.qualifications}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter each qualification on a new line"
                />
              </label>

              <label>
                Skills
                <textarea
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  rows="3"
                  placeholder="React, JavaScript, HTML, CSS"
                />
              </label>

              {/* NEW FIELD: BENEFITS */}

              <label>
                Benefits
                <textarea
                  name="benefits"
                  value={form.benefits}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter each benefit on a new line"
                />
              </label>

              {/* NEW FIELD: APPLICATION INSTRUCTIONS */}

              <label>
                Application Instructions
                <textarea
                  name="applicationInstructions"
                  value={form.applicationInstructions}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter instructions for candidates applying for this job"
                />
              </label>

              <div className="job-form-actions">

                <button
                  type="submit"
                  className="button button-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Job"
                    : "Create Job"}
                </button>

                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

              </div>

            </form>
          </section>
        )}

        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <h3>No jobs found</h3>
            <p>Create your first job posting.</p>
          </div>
        ) : (
          <div className="admin-jobs-list">

            {jobs.map((job) => (
              <article className="admin-job-card" key={job._id}>

                <div className="admin-job-info">

                  <h3>{job.title}</h3>

                  <p>
                    {job.company} · {job.location}
                  </p>

                  <div className="admin-job-meta">
                    <span>{job.employmentType}</span>
                    <span>{job.workMode}</span>
                    <span className={`job-status ${job.status}`}>
                      {job.status}
                    </span>
                  </div>

                </div>

                <div className="admin-job-actions">

                  <button
                    className="button button-outline"
                    onClick={() => openEditForm(job)}
                  >
                    Edit
                  </button>

                  <button
                    className="button button-primary"
                    onClick={() => handleStatusChange(job)}
                  >
                    {job.status === "published"
                      ? "Close Job"
                      : "Publish"}
                  </button>

                  <button
                    className="delete-job-button"
                    onClick={() => handleDelete(job._id)}
                  >
                    Delete
                  </button>

                </div>

              </article>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}

export default AdminJobs;