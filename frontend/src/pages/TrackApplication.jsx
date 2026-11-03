import { useState } from "react";
import API from "../services/api";
import { Search, CheckCircle, Clock, Briefcase } from "lucide-react";

const STATUS_STEPS = [
  "Submitted",
  "Under Review",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
];

function TrackApplication() {
  const [applicationId, setApplicationId] = useState("");
  const [email, setEmail] = useState("");
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trackApplication = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setApplication(null);

    try {
      const response = await API.post("/applications/track", {
        applicationId: applicationId.trim(),
        email: email.trim(),
      });

      setApplication(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to find your application."
      );
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = application?.status;
  const currentStep = STATUS_STEPS.indexOf(currentStatus);

  return (
    <div className="tracking-page">
      <div className="tracking-container">

        <div className="tracking-heading">
          <span>CAREERTRACK</span>
          <h1>Track Your Application</h1>
          <p>
            Stay updated on your job application progress.
          </p>
        </div>

        <form
          className="tracking-form"
          onSubmit={trackApplication}
        >
          <label>Application ID</label>

          <input
            type="text"
            placeholder="Enter your application ID"
            value={applicationId}
            onChange={(e) =>
              setApplicationId(e.target.value)
            }
            required
          />

          <label>Registered Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            <Search size={18} />
            {loading ? "Checking..." : "Track Application"}
          </button>

          {error && (
            <p className="tracking-error">{error}</p>
          )}
        </form>

        {application && (
          <div className="tracking-result">

            <div className="tracking-success">
              <CheckCircle size={22} />
              Application Found
            </div>

            <div className="tracking-job-info">
              <Briefcase size={25} />

              <div>
                <h2>
                  {application.job?.title || "Job"}
                </h2>

                <p>
                  {application.job?.company || "Company"}
                </p>
              </div>
            </div>

            <div className="tracking-details">
              <div>
                <span>Application ID</span>
                <strong>{application.applicationId}</strong>
              </div>

              <div>
                <span>Applied On</span>
                <strong>
                  {application.appliedAt
                    ? new Date(
                        application.appliedAt
                      ).toLocaleDateString()
                    : "N/A"}
                </strong>
              </div>

              <div>
                <span>Current Status</span>
                <strong>{currentStatus}</strong>
              </div>
            </div>

            <h3>Application Progress</h3>

            {currentStatus === "Rejected" ? (
              <div className="rejected-status">
                Your application was not selected
                for this position.
              </div>
            ) : (
              <div className="tracking-timeline">
                {STATUS_STEPS.map((status, index) => {
                  const completed =
                    currentStep >= index;

                  return (
                    <div
                      className={`timeline-step ${
                        completed ? "completed" : ""
                      }`}
                      key={status}
                    >
                      <div className="timeline-icon">
                        {completed ? (
                          <CheckCircle size={20} />
                        ) : (
                          <Clock size={20} />
                        )}
                      </div>

                      <span>{status}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="tracking-updated">
              Last updated:{" "}
              {application.lastUpdated
                ? new Date(
                    application.lastUpdated
                  ).toLocaleString()
                : "N/A"}
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

export default TrackApplication;