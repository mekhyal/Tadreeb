import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaLock, FaHome } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import loginImage from "../../assets/login-image-2.svg";

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/`~]).{8,24}$/;

const mockUsers = [
  {
    id: 1,
    name: "Roselle Ehrman",
    email: "student@tadreeb.com",
    password: "Student123!",
    role: "student",
  },
  {
    id: 2,
    name: "Creative Tech",
    email: "company@tadreeb.com",
    password: "Company123!",
    role: "company",
  },
  {
    id: 3,
    name: "Abdulaziz",
    email: "admin@tadreeb.com",
    password: "Admin123!",
    role: "admin",
  },
];

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isNavigatingHome, setIsNavigatingHome] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!PWD_REGEX.test(formData.password)) {
      newErrors.password =
        "Password must be 8-24 characters and include uppercase, lowercase, number, and special character.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const matchedUser = mockUsers.find(
      (user) =>
        user.email.toLowerCase() === formData.email.toLowerCase() &&
        user.password === formData.password
    );

    if (!matchedUser) {
      setErrors({
        general: "Invalid email or password.",
      });
      return;
    }

    setIsSubmitting(true);

    const userData = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
    };

    login(userData);

    setTimeout(() => {
      if (matchedUser.role === "student") {
        navigate("/student", { replace: true });
        return;
      }

      if (matchedUser.role === "company") {
        navigate("/company/dashboard", { replace: true });
        return;
      }

      if (matchedUser.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }, 500);
  };

  const delayedNavigateHome = () => {
    if (location.pathname === "/") return;

    setIsNavigatingHome(true);

    setTimeout(() => {
      navigate("/");
    }, 450);
  };

  return (
    <>
      {(isNavigatingHome || isSubmitting) && (
        <div className="app-global-loader">
          <div className="app-loader-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>{isSubmitting ? "Signing in..." : "Loading page..."}</p>
        </div>
      )}

      <section className="auth-page">
        <div className="auth-wrapper auth-wrapper-login">
          <div className="auth-visual-side auth-visual-login">
            <img
              src={loginImage}
              alt="Login illustration"
              className="auth-side-image auth-login-image"
            />
          </div>

          <div className="auth-form-side">
            <div className="auth-form-card">
              <div className="auth-brand">
                <div className="auth-brand">
                  <span className="auth-logo-dark">Tad</span>
                  <span className="auth-logo-blue">reeb</span>
                </div>
              </div>

              <h2 className="auth-title">Login into your account</h2>

              <form onSubmit={handleSubmit} className="auth-form" noValidate>
                <div className="auth-field-group">
                  <label htmlFor="email">Email Id :</label>
                  <div className="auth-input-wrap">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                    <span className="auth-input-icon">
                      <FaEnvelope />
                    </span>
                  </div>
                  {errors.email && <p className="auth-error">{errors.email}</p>}
                </div>

                <div className="auth-field-group">
                  <label htmlFor="password">Password</label>
                  <div className="auth-input-wrap">
                    <input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                    />
                    <span className="auth-input-icon">
                      <FaLock />
                    </span>
                  </div>
                  {errors.password && (
                    <p className="auth-error">{errors.password}</p>
                  )}
                </div>

                <div className="auth-row-end">
                  <button type="button" className="auth-text-btn">
                    Forgot password?
                  </button>
                </div>

                {errors.general && (
                  <p className="auth-error auth-error-general">{errors.general}</p>
                )}

                <button type="submit" className="auth-main-btn">
                  Login now
                </button>

                <div className="auth-divider">
                  <span>OR</span>
                </div>

                <Link to="/signup" className="auth-secondary-btn">
                  Signup now
                </Link>
              </form>

              <div className="auth-home-link">
                <button
                  type="button"
                  className="auth-home-btn"
                  onClick={delayedNavigateHome}
                >
                  <FaHome />
                  <span>Home</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;