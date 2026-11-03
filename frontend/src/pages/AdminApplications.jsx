import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  Download,
  FileSpreadsheet,
  Trash2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

const STATUSES = [
  "Submitted",
  "Under Review",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
  "Rejected",
];

function AdminApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
  });

  const token = localStorage.getItem("adminToken");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleAuthError = (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
      return true;
    }
    return false;
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: 10,
      };

      if (filter) {
        params.status = filter;
      }

      const response = await API.get("/applications", {
        ...authConfig,
        params,
      });

      setApplications(response.data.data || []);
      setPagination(
        response.data.pagination || { total: 0, pages: 1 }
      );
    } catch (error) {
      if (!handleAuthError(error)) {
        alert(
          error.response?.data?.message ||
            "Applications load nahi ho payi."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchApplications();
  }, [page, filter]);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(
        `/applications/${id}/status`,
        { status },
        authConfig
      );

      alert("Application status updated!");
      fetchApplications();
    } catch (error) {
      if (!handleAuthError(error)) {
        alert(
          error.response?.data?.message ||
            "Status update nahi hua."
        );
      }
    }
  };

  const deleteApplication = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/applications/${id}`, authConfig);

      alert("Application deleted successfully!");
      fetchApplications();
    } catch (error) {
      if (!handleAuthError(error)) {
        alert(
          error.response?.data?.message ||
            "Application delete nahi hui."
        );
      }
    }
  };

  const downloadResume = async (id, filename) => {
    try {
      const response = await API.get(
        `/applications/${id}/resume`,
        {
          ...authConfig,
          responseType: "blob",
        }
      );

      const blobUrl = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || "resume";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      if (!handleAuthError(error)) {
        alert("Resume download nahi ho paya.");
      }
    }
  };

  const exportCSV = async () => {
    try {
      const response = await API.get(
        "/applications/export/csv",
        {
          ...authConfig,
          responseType: "blob",
        }
      );

      const blobUrl = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "text/csv",
        })
      );

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "applications.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      if (!handleAuthError(error)) {
        alert("CSV export nahi ho paya.");
      }
    }
  };

  return (
    <div className="applications-page">
      <div className="applications-header">
        <div>
          <button
            className="back-button"
            onClick={() => navigate("/admin/dashboard")}
          >
            <ArrowLeft size={17} /> Dashboard
          </button>

          <h1>Applications Management</h1>
          <p>Manage and review candidate applications.</p>
        </div>

        <div className="application-header-actions">
          <button
            className="refresh-button"
            onClick={fetchApplications}
          >
            <RefreshCw size={17} /> Refresh
          </button>

          <button
            className="export-button"
            onClick={exportCSV}
          >
            <FileSpreadsheet size={17} /> Export CSV
          </button>
        </div>
      </div>

      <div className="applications-toolbar">
        <div>
          <h3>All Applications</h3>
          <p>Total: {pagination.total || 0}</p>
        </div>

        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Statuses</option>

          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="applications-loading">
          Loading applications...
        </div>
      ) : applications.length === 0 ? (
        <div className="applications-empty">
          <h3>No applications found</h3>
          <p>Applications will appear here when candidates apply.</p>
        </div>
      ) : (
        <div className="applications-table-wrapper">
          <table className="applications-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Job</th>
                <th>Contact</th>
                <th>Applied On</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>
                    <strong>{app.candidateName}</strong>
<small>{app.education}</small>
<small>ID: {app._id}</small>

<button
  type="button"
  onClick={() => {
    navigator.clipboard.writeText(app._id);
    alert("Application ID copied!");
  }}
>
  Copy ID
</button>
                  
                  </td>

                  <td>
                    <strong>
                      {app.job?.title || "Job unavailable"}
                    </strong>
                    <small>{app.job?.company || ""}</small>
                  </td>

                  <td>
                    <span>{app.email}</span>
                    <small>{app.phone}</small>
                  </td>

                  <td>
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td>
                    {app.resume?.filename ? (
                      <button
                        className="resume-button"
                        onClick={() =>
                          downloadResume(
                            app._id,
                            app.resume.filename
                          )
                        }
                      >
                        <Download size={15} /> Download
                      </button>
                    ) : (
                      "Not uploaded"
                    )}
                  </td>

                  <td>
                    <select
                      className="status-select"
                      value={app.status}
                      onChange={(e) =>
                        updateStatus(app._id, e.target.value)
                      }
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <button
                      className="delete-application-button"
                      onClick={() => deleteApplication(app._id)}
                      title="Delete application"
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="applications-pagination">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <span>
          Page {page} of {pagination.pages || 1}
        </span>

        <button
          disabled={page >= (pagination.pages || 1)}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminApplications;