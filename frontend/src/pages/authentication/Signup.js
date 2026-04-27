import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import signupImage from "../../assets/Sign up-image-2.svg";
import { useAuth } from "../../context/AuthContext";
import { registerStudent } from "../../api/authAPI";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIREMENTS_MESSAGE,
  isPasswordStrong,
} from "../../utils/passwordRules";

const LIMITS = {
  firstName: 40,
  lastName: 40,
  email: 120,
  mobile: 20,
  passwordMin: PASSWORD_MIN_LENGTH,
  passwordMax: PASSWORD_MAX_LENGTH,
  university: 100,
  studentId: 30,
  major: 80,
  skills: 150,
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

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    university: "",
    studentId: "",
    major: "",
    year: "First",
    gender: "Male",
    skills: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getEmailDomain = (email) => {
    return email.trim().toLowerCase().split("@")[1] || "";
  };

  const isAllowedEmailDomain = (email) => {
    const domain = getEmailDomain(email);
    return ALLOWED_EMAIL_DOMAINS.includes(domain);
  };

  const checkLength = (field, label, limit, nextErrors) => {
    if (formData[field].trim().length > limit) {
      nextErrors[field] = `${label} must be ${limit} characters or less.`;
    }
  };


  const getUserFromResponse = (data) => {
    return data.user || data.student;
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters.";
    } else {
      checkLength("firstName", "First name", LIMITS.firstName, newErrors);
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters.";
    } else {
      checkLength("lastName", "Last name", LIMITS.lastName, newErrors);
    }

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

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (formData.mobile.trim().length < 7) {
      newErrors.mobile = "Mobile number must be at least 7 characters.";
    } else {
      checkLength("mobile", "Mobile number", LIMITS.mobile, newErrors);
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (!isPasswordStrong(formData.password)) {
      newErrors.password = PASSWORD_REQUIREMENTS_MESSAGE;
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password and confirm password do not match.";
    }

    if (!formData.university.trim()) {
      newErrors.university = "University name is required.";
    } else {
      checkLength("university", "University name", LIMITS.university, newErrors);
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required.";
    } else {
      checkLength("studentId", "Student ID", LIMITS.studentId, newErrors);
    }

    if (!formData.major.trim()) {
      newErrors.major = "Major is required.";
    } else {
      checkLength("major", "Major", LIMITS.major, newErrors);
    }

    if (!formData.year) {
      newErrors.year = "Year is required.";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required.";
    }

    if (!formData.skills.trim()) {
      newErrors.skills = "Skills are required.";
    } else {
      checkLength("skills", "Skills", LIMITS.skills, newErrors);
    }

    return newErrors;
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
      const payload = {
        universityID: formData.studentId.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        mobileNo: formData.mobile.trim(),
        gender: formData.gender,
        universityName: formData.university.trim(),
        major: formData.major.trim(),
        year: formData.year,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const response = await registerStudent(payload);

      const token = response.data.token;
      const user = getUserFromResponse(response.data);

      if (!token || !user) {
        setErrors({
          general: "Signup response is missing user or token.",
        });
        return;
      }

      login(user, token);
      navigate("/student", { replace: true });
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.message || "Signup failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && (
        <div className="app-global-loader">
          <div className="app-loader-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Creating account...</p>
        </div>
      )}

      <section className="auth-page">
        <div className="auth-wrapper auth-wrapper-signup">
          <div className="auth-form-side signup-side">
            <div className="auth-form-card signup-card">
              <div className="auth-brand auth-brand-center">
                <span className="auth-logo-dark">Tad</span>
                <span className="auth-logo-blue">reeb</span>
              </div>

              <h2 className="auth-title">Sign up into your account</h2>

              <form onSubmit={handleSubmit} className="signup-form-grid" noValidate>
                <div className="auth-field-group">
                  <label htmlFor="firstName">First Name :</label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    maxLength={LIMITS.firstName}
                  />
                  {errors.firstName && (
                    <p className="auth-error">{errors.firstName}</p>
                  )}
                </div>

                <div className="auth-field-group">
                  <label htmlFor="lastName">Last Name :</label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    maxLength={LIMITS.lastName}
                  />
                  {errors.lastName && (
                    <p className="auth-error">{errors.lastName}</p>
                  )}
                </div>

                <div className="auth-field-group">
                  <label htmlFor="email">Email Id :</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    maxLength={LIMITS.email}
                  />
                  {errors.email && <p className="auth-error">{errors.email}</p>}
                </div>

                <div className="auth-field-group">
                  <label htmlFor="mobile">Mobile No. :</label>
                  <input
                    id="mobile"
                    type="text"
                    name="mobile"
                    placeholder="+965 50000000"
                    value={formData.mobile}
                    onChange={handleChange}
                    maxLength={LIMITS.mobile}
                  />
                  {errors.mobile && (
                    <p className="auth-error">{errors.mobile}</p>
                  )}
                </div>

                <div className="auth-field-group">
                  <label htmlFor="password">Password :</label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    maxLength={LIMITS.passwordMax}
                  />
                  {errors.password && (
                    <p className="auth-error">{errors.password}</p>
                  )}
                </div>

                <div className="auth-field-group">
                  <label htmlFor="confirmPassword">Confirm Password :</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    maxLength={LIMITS.passwordMax}
                  />
                  {errors.confirmPassword && (
                    <p className="auth-error">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="auth-field-group">
                  <label htmlFor="university">University Name :</label>
                  <input
                    id="university"
                    type="text"
                    name="university"
                    placeholder="Enter university name"
                    value={formData.university}
                    onChange={handleChange}
                    maxLength={LIMITS.university}
                  />
                  {errors.university && (
                    <p className="auth-error">{errors.university}</p>
                  )}
                </div>

                <div className="auth-field-group">
                  <label htmlFor="studentId">Student Id :</label>
                  <input
                    id="studentId"
                    type="text"
                    name="studentId"
                    placeholder="1234567"
                    value={formData.studentId}
                    onChange={handleChange}
                    maxLength={LIMITS.studentId}
                  />
                  {errors.studentId && (
                    <p className="auth-error">{errors.studentId}</p>
                  )}
                </div>

                <div className="auth-field-group">
                  <label htmlFor="major">Major :</label>
                  <input
                    id="major"
                    type="text"
                    name="major"
                    placeholder="Computer Science"
                    value={formData.major}
                    onChange={handleChange}
                    maxLength={LIMITS.major}
                  />
                  {errors.major && <p className="auth-error">{errors.major}</p>}
                </div>

                <div className="auth-field-group">
                  <label htmlFor="year">Year :</label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                  >
                    <option>First</option>
                    <option>Second</option>
                    <option>Third</option>
                    <option>Fourth</option>
                    <option>Fifth</option>
                  </select>
                  {errors.year && <p className="auth-error">{errors.year}</p>}
                </div>

                <div className="auth-field-group">
                  <label htmlFor="gender">Gender :</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                  {errors.gender && <p className="auth-error">{errors.gender}</p>}
                </div>

                <div className="auth-field-group">
                  <label htmlFor="skills">Skills :</label>
                  <input
                    id="skills"
                    type="text"
                    name="skills"
                    placeholder="React, UI/UX, Python ..."
                    value={formData.skills}
                    onChange={handleChange}
                    maxLength={LIMITS.skills}
                  />
                  {errors.skills && <p className="auth-error">{errors.skills}</p>}
                </div>

                {errors.general && (
                  <p className="auth-error grid-full">{errors.general}</p>
                )}

                <div className="signup-actions grid-full">
                  <button
                    type="submit"
                    className="auth-main-btn signup-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Sign up"}
                  </button>

                  <Link to="/login" className="auth-secondary-btn signup-back-btn">
                    Back
                  </Link>
                </div>
              </form>
            </div>
          </div>

          <div className="auth-visual-side signup-visual">
            <img
              src={signupImage}
              alt="Signup illustration"
              className="auth-side-image auth-signup-image"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default Signup;