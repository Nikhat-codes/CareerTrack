import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("adminToken");

        if (!token) {
          navigate("/admin/login");
          return;
        }

        const response = await API.get("/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(response.data.data || response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  }

 const cards = [
  {
    title: "Total Jobs",
    value: stats?.jobs?.total ?? 0,
    icon: "💼",
},
  {
    title: "Active Jobs",
    value: stats?.jobs?.published ?? 0,
    icon: "📢",
  },
  {
    title: "Total Applications",
    value: stats?.applications?.total ?? 0,
    icon: "📄",
  },
  {
    title: "Pending Applications",
    value: stats?.applications?.submitted ?? 0,
    icon: "⏳",
  },
];

  return (
    <div className="admin-dashboard">
      <aside className="dashboard-sidebar">
        <h2>CareerTrack</h2>
        <p>ADMIN PANEL</p>

        <button className="active">📊 Dashboard</button>
        <button onClick={() => navigate("/admin/jobs")}>💼 Manage Jobs</button>
        <button onClick={() => navigate("/admin/applications")}>📄 Applications</button>

        <button className="logout-button" onClick={handleLogout}>
          ↪ Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p>CAREERTRACK ADMIN</p>
            <h1>Dashboard Overview</h1>
            <span>Welcome to your admin panel.</span>
          </div>
          <div className="admin-avatar">A</div>
        </header>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : error ? (
          <p className="dashboard-error">{error}</p>
        ) : (
          <>
            <h2 className="section-heading">Platform Statistics</h2>

            <div className="dashboard-cards">
              {cards.map((card) => (
                <div className="stat-card" key={card.title}>
                  <div className="stat-icon">{card.icon}</div>
                  <p>{card.title}</p>
                  <h2>{card.value}</h2>
                </div>
              ))}
            </div>

            <div className="dashboard-welcome">
              <h2>Manage your recruitment platform</h2>
              <p>
                Manage job postings and review candidate applications
                from one place.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;