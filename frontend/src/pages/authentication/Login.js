import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaLock, FaHome } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import {
  loginStudent,
  loginCompany,
  loginAdmin,
} from "../../api/authAPI";
import loginImage from "../../assets/login-image-2.svg";

const LIMITS = {
  email: 120,
  /** Login accepts whatever the user stored; cap input for basic abuse prevention. */
  passwordInputMax: 128,
};

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const ALLOWED_EMAIL_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "yahoo.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "tadreeb.com",
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
  const [successMessage, setSuccessMessage] = useState(
    location.state?.signupSuccess || ""
  );
  const [isNavigatingHome, setIsNavigatingHome] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 6000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  const getEmailDomain = (email) => {
    return email.trim().toLowerCase().split("@")[1] || "";
  };

  const isAllowedEmailDomain = (email) => {
    const domain = getEmailDomain(email);
    return ALLOWED_EMAIL_DOMAINS.includes(domain);
  };

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
    const email = formData.email.trim();

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (email.length > LIMITS.email) {
      newErrors.email = `Email must be ${LIMITS.email} characters or less.`;
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    } else if (!isAllowedEmailDomain(email)) {
      newErrors.email =
        "Please use a supported email provider such as Gmail, Outlook, Hotmail, Yahoo, iCloud, or Proton.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length > LIMITS.passwordInputMax) {
      newErrors.password = "Password is too long.";
    }

    return newErrors;
  };

  const getUserFromResponse = (data) => {
    return data.user || data.student || data.company || data.admin;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const loginData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      let response;

      try {
        response = await loginStudent(loginData);
      } catch {
        try {
          response = await loginCompany(loginData);
        } catch {
          response = await loginAdmin(loginData);
        }
      }

      const token = response.data.token;
      const user = getUserFromResponse(response.data);

      if (!token || !user) {
        setErrors({
          general: "Login response is missing user or token.",
        });
        return;
      }

      login(user, token);

      if (user.role === "student") {
        navigate("/student", { replace: true });
        return;
      }

      if (user.role === "company") {
        navigate("/company/dashboard", { replace: true });
        return;
      }

      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.message || "Invalid email or password.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                <span className="auth-logo-dark">Tad</span>
                <span className="auth-logo-blue">reeb</span>
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
                      maxLength={LIMITS.email}
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
                      maxLength={LIMITS.passwordInputMax}
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

                {successMessage && (
                  <p className="auth-success-message">{successMessage}</p>
                )}

                {errors.general && (
                  <p className="auth-error auth-error-general">
                    {errors.general}
                  </p>
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
