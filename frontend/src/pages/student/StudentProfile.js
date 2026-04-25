import React, { useMemo, useState } from "react";
import { FaUserCircle, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import StudentTopbar from "../../components/student/StudentTopbar";
import StudentFooter from "../../components/student/StudentFooter";

const LIMITS = {
  firstName: 40,
  lastName: 40,
  passwordMin: 8,
  passwordMax: 24,
  mobile: 20,
  university: 100,
  major: 80,
  skills: 150,
  studentId: 30,
};

function StudentProfile() {
  const storedUser = useMemo(() => {
    const user = localStorage.getItem("tadreebUser");
    return user ? JSON.parse(user) : {};
  }, []);

  const [formData, setFormData] = useState({
    firstName: storedUser?.name?.split(" ")[0] || "Abdulaziz",
    lastName: storedUser?.name?.split(" ").slice(1).join(" ") || "",
    password: "",
    mobile: "",
    gender: "Male",
    year: "Fourth",
    university: "Kuwait University",
    major: "Computer Science",
    skills: "React, UI/UX, Frontend",
    studentId: "2212173741",
    email: storedUser?.email || "abdulaziz@gmail.com",
  });

  const [errors, setErrors] = useState({});
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const checkLength = (field, label, limit, nextErrors) => {
    if (formData[field].trim().length > limit) {
      nextErrors[field] = `${label} must be ${limit} characters or less.`;
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    } else if (formData.firstName.trim().length < 2) {
      nextErrors.firstName = "First name must be at least 2 characters.";
    } else {
      checkLength("firstName", "First name", LIMITS.firstName, nextErrors);
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    } else if (formData.lastName.trim().length < 2) {
      nextErrors.lastName = "Last name must be at least 2 characters.";
    } else {
      checkLength("lastName", "Last name", LIMITS.lastName, nextErrors);
    }

    if (formData.password.trim()) {
      if (formData.password.length < LIMITS.passwordMin) {
        nextErrors.password = `Password must be at least ${LIMITS.passwordMin} characters.`;
      } else if (formData.password.length > LIMITS.passwordMax) {
        nextErrors.password = `Password must be ${LIMITS.passwordMax} characters or less.`;
      }
    }

    if (!formData.mobile.trim()) {
      nextErrors.mobile = "Mobile number is required.";
    } else if (formData.mobile.trim().length < 7) {
      nextErrors.mobile = "Mobile number must be at least 7 characters.";
    } else {
      checkLength("mobile", "Mobile number", LIMITS.mobile, nextErrors);
    }

    if (!formData.gender) {
      nextErrors.gender = "Gender is required.";
    }

    if (!formData.year) {
      nextErrors.year = "Year is required.";
    }

    if (!formData.university.trim()) {
      nextErrors.university = "University name is required.";
    } else {
      checkLength("university", "University name", LIMITS.university, nextErrors);
    }

    if (!formData.major.trim()) {
      nextErrors.major = "Major is required.";
    } else {
      checkLength("major", "Major", LIMITS.major, nextErrors);
    }

    if (!formData.skills.trim()) {
      nextErrors.skills = "Skills are required.";
    } else {
      checkLength("skills", "Skills", LIMITS.skills, nextErrors);
    }

    if (!formData.studentId.trim()) {
      nextErrors.studentId = "Student ID is required.";
    } else {
      checkLength("studentId", "Student ID", LIMITS.studentId, nextErrors);
    }

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
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
    }));
  };

  const handleSave = () => {
    if (!validateForm()) return;

    setIsSaving(true);

    setTimeout(() => {
      localStorage.setItem(
        "tadreebUser",
        JSON.stringify({
          role: "student",
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
        })
      );

      setShowSavePopup(true);
      setIsSaving(false);

      setTimeout(() => {
        setShowSavePopup(false);
      }, 5000);
    }, 500);
  };

  return (
    <div className="student-page">
      <StudentTopbar />

      <main className="student-profile-page container">
        {showSavePopup && (
          <div className="student-save-toast">
            <div className="student-save-toast__content">
              <FaCheckCircle className="student-save-toast__icon" />
              <span>Profile changes saved successfully.</span>
            </div>
            <div className="student-save-toast__progress"></div>
          </div>
        )}

        <div className="student-profile-header">
          <div className="student-profile-user">
            <div className="student-profile-avatar">
              <FaUserCircle />
            </div>

            <div>
              <h2>{`${formData.firstName} ${formData.lastName}`.trim()}</h2>
              <p>{formData.email}</p>
            </div>
          </div>

          <button
            type="button"
            className="student-save-btn"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="student-profile-form-grid">
          <div className="student-form-group">
            <label>First Name</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              maxLength={LIMITS.firstName}
            />
            {errors.firstName && <p className="student-form-error">{errors.firstName}</p>}
          </div>

          <div className="student-form-group">
            <label>Last Name</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              maxLength={LIMITS.lastName}
            />
            {errors.lastName && <p className="student-form-error">{errors.lastName}</p>}
          </div>

          <div className="student-form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              maxLength={LIMITS.passwordMax}
            />
            {errors.password && <p className="student-form-error">{errors.password}</p>}
          </div>

          <div className="student-form-group">
            <label>Mobile No.</label>
            <input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              maxLength={LIMITS.mobile}
            />
            {errors.mobile && <p className="student-form-error">{errors.mobile}</p>}
          </div>

          <div className="student-form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option>Male</option>
              <option>Female</option>
            </select>
            {errors.gender && <p className="student-form-error">{errors.gender}</p>}
          </div>

          <div className="student-form-group">
            <label>Year</label>
            <select name="year" value={formData.year} onChange={handleChange}>
              <option>First</option>
              <option>Second</option>
              <option>Third</option>
              <option>Fourth</option>
              <option>Fifth</option>
            </select>
            {errors.year && <p className="student-form-error">{errors.year}</p>}
          </div>

          <div className="student-form-group">
            <label>University Name</label>
            <input
              name="university"
              value={formData.university}
              onChange={handleChange}
              placeholder="Enter university name"
              maxLength={LIMITS.university}
            />
            {errors.university && <p className="student-form-error">{errors.university}</p>}
          </div>

          <div className="student-form-group">
            <label>Major</label>
            <input
              name="major"
              value={formData.major}
              onChange={handleChange}
              placeholder="Enter major"
              maxLength={LIMITS.major}
            />
            {errors.major && <p className="student-form-error">{errors.major}</p>}
          </div>

          <div className="student-form-group">
            <label>Skills</label>
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Enter your skills"
              maxLength={LIMITS.skills}
            />
            {errors.skills && <p className="student-form-error">{errors.skills}</p>}
          </div>

          <div className="student-form-group">
            <label>Student ID</label>
            <input
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Enter student ID"
              maxLength={LIMITS.studentId}
            />
            {errors.studentId && <p className="student-form-error">{errors.studentId}</p>}
          </div>
        </div>

        <div className="student-email-section">
          <h3>My Email Address</h3>

          <div className="student-email-card">
            <div className="student-email-icon">
              <FaEnvelope />
            </div>

            <div>
              <h4>{formData.email}</h4>
              <p>1 month ago</p>
            </div>
          </div>
        </div>
      </main>

      <StudentFooter />
    </div>
  );
}

export default StudentProfile;