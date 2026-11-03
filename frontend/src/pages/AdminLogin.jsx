import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminLogin() {
const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

async function handleLogin(event) {
event.preventDefault();


setError("");
setLoading(true);

try {
  const response = await API.post("/auth/login", {
    email,
    password,
  });

  const token = response.data.token;

  if (!token) {
    throw new Error("Login token was not received.");
  }

  localStorage.setItem("adminToken", token);

  navigate("/admin/dashboard");
} catch (err) {
  setError(
    err.response?.data?.message ||
      err.message ||
      "Login failed. Please try again."
  );
} finally {
  setLoading(false);
}


}

return ( <div className="admin-login-page"> <div className="admin-login-card">


    <div className="login-logo">C</div>

    <p className="eyebrow">CAREERTRACK ADMIN</p>

    <h1>Welcome back</h1>

    <p className="login-description">
      Sign in to manage jobs and candidate applications.
    </p>

    <form onSubmit={handleLogin}>

      <label>
        Email address

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter admin email"
          required
        />
      </label>

      <label>
        Password

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </label>

      {error && (
        <p className="login-error">{error}</p>
      )}

      <button
        type="submit"
        className="button-full"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

    </form>

    <button
      type="button"
      className="back-home"
      onClick={() => navigate("/")}
    >
      ← Back to CareerTrack
    </button>

  </div>
</div>

);
}

export default AdminLogin;
