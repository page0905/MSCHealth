import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setErrors({});
    setLoading(true);

    const validationErrors = {};
    if (!email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "Email is invalid";
    }

    if (!password.trim()) {
      validationErrors.password = "Password is required";
    } else if (password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/users?email=${email}&password=${password}`
      );
      const users = await response.json();

      if (users.length > 0) {
        const user = users[0];
        sessionStorage.setItem("auth-token", user.id);
        sessionStorage.setItem("email", user.email);
        navigate("/");
      } else {
        setServerError("Email or password is wrong!");
      }
    } catch (error) {
      setServerError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="container-l">
      <div className="login-box">
        <h2>Login</h2>
        <p>
          Are you a new member? <Link to="/signup">Sign Up</Link>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              autoFocus
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          {serverError && <p className="error-text">{serverError}</p>}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="forgot-password">
            <Link to="/">Forgot Password?</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
