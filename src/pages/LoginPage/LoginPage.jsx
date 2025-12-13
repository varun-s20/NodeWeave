import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "lucide-react";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const { email, password, confirmPassword } = formData;

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (isLoginMode) {
      // Login Logic
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === email && user.password === password) {
          localStorage.setItem("isLoggedIn", "true");
          navigate("/builder");
        } else {
          setError("Invalid email or password");
        }
      } else {
        setError("User not found. Please sign up.");
      }
    } else {
      // Signup Logic
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // Save user
      const user = { email, password };
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
      navigate("/builder");
    }
  };

  const toggleMode = (e) => {
    e.preventDefault();
    setIsLoginMode(!isLoginMode);
    setError("");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="login-container">
      {/* Left Side - Marketing */}
      <div className="login-marketing">
        <div className="brand-logo">
          <div className="logo-icon">
            <Box size={24} color="white" />
          </div>
          <span>NodeWeave</span>
        </div>

        <div className="marketing-content">
          <div className="preview-card">
            <div className="abstract-shape"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="login-form-container">
        <div className="form-wrapper">
          <h2>{isLoginMode ? "Welcome back" : "Create an account"}</h2>
          <p className="subtitle">
            {isLoginMode
              ? "Enter your credentials to access your account."
              : "Start automating your workflows today."}
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div
                className="error-message"
                style={{ color: "red", marginBottom: "10px", fontSize: "14px" }}
              >
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="name@company.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
              />
            </div>

            {!isLoginMode && (
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                />
              </div>
            )}

            <div className="form-actions">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              {isLoginMode && (
                <a href="#" className="forgot-password">
                  Forgot Password?
                </a>
              )}
            </div>

            <button type="submit" className="btn-primary">
              {isLoginMode ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <p className="login-footer">
            {isLoginMode
              ? "Don't have an account? "
              : "Already have an account? "}
            <a href="#" onClick={toggleMode}>
              {isLoginMode ? "Sign Up" : "Login here"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
