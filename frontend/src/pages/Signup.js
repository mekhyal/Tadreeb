import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import signupImage from "../assets/Sign up-image-2.svg";

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/`~]).{8,24}$/;

function Signup() {
  const navigate = useNavigate();

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

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";

    if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    }

    if (!PWD_REGEX.test(formData.password)) {
      newErrors.password =
        "Password must be 8-24 characters and include uppercase, lowercase, number, and special character.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password and confirm password do not match.";
    }

    if (!formData.university.trim()) {
      newErrors.university = "University name is required.";
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required.";
    }

    if (!formData.major.trim()) {
      newErrors.major = "Major is required.";
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

    localStorage.setItem(
      "tadreebUser",
      JSON.stringify({
        role: "student",
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
      })
    );

    navigate("/student");
  };

  return (
    <section className="auth-page">
      <div className="auth-wrapper auth-wrapper-signup">
        <div className="auth-form-side signup-side">
          <div className="auth-form-card signup-card">
            <div className="auth-brand auth-brand-center">
              <span className="logo-dark auth-logo-dark">Tad</span>
              <span className="logo-blue">reeb</span>
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
                />
                {errors.firstName && <p className="auth-error">{errors.firstName}</p>}
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
                />
                {errors.lastName && <p className="auth-error">{errors.lastName}</p>}
              </div>

              <div className="auth-field-group">
                <label htmlFor="email">Email Id :</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="example@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
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
                />
                {errors.mobile && <p className="auth-error">{errors.mobile}</p>}
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
                />
                {errors.password && <p className="auth-error">{errors.password}</p>}
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
                />
              </div>

              {errors.general && <p className="auth-error grid-full">{errors.general}</p>}

              <div className="signup-actions grid-full">
                <button type="submit" className="auth-main-btn signup-btn">
                  Sign up
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
  );
}

export default Signup;