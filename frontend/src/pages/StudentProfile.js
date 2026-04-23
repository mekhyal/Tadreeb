import React, { useMemo, useState } from "react";
import { FaUserCircle, FaEnvelope } from "react-icons/fa";
import StudentTopbar from "../components/student/StudentTopbar";
import StudentFooter from "../components/student/StudentFooter";

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

  const [saveMessage, setSaveMessage] = useState("");
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSaveMessage("");
  };

  const handleSave = () => {
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

      setSaveMessage("Profile changes saved successfully.");
      setShowSavePopup(true);
      setIsSaving(false);

      setTimeout(() => {
        setShowSavePopup(false);
      }, 3000);
    }, 500);
  };

  return (
    <div className="student-page">
      <StudentTopbar />

      <main className="student-profile-page container">
        {showSavePopup && (
          <div className="student-save-popup">
            Profile changes saved successfully.
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
            {isSaving ? "Saving..." : "Save Change"}
          </button>
        </div>

        {saveMessage && !showSavePopup && (
          <p className="student-save-message">{saveMessage}</p>
        )}

        <div className="student-profile-form-grid">
          <div className="student-form-group">
            <label>First Name</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
            />
          </div>

          <div className="student-form-group">
            <label>Last Name</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
            />
          </div>

          <div className="student-form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>

          <div className="student-form-group">
            <label>Mobile No.</label>
            <input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
            />
          </div>

          <div className="student-form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option>Male</option>
              <option>Female</option>
            </select>
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
          </div>

          <div className="student-form-group">
            <label>University Name</label>
            <input
              name="university"
              value={formData.university}
              onChange={handleChange}
              placeholder="Enter university name"
            />
          </div>

          <div className="student-form-group">
            <label>Major</label>
            <input
              name="major"
              value={formData.major}
              onChange={handleChange}
              placeholder="Enter major"
            />
          </div>

          <div className="student-form-group">
            <label>Skills</label>
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Enter your skills"
            />
          </div>

          <div className="student-form-group">
            <label>Student ID</label>
            <input
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Enter student ID"
            />
          </div>
        </div>

        <div className="student-email-section">
          <h3>My email Address</h3>

          <div className="student-email-card">
            <div className="student-email-icon">
              <FaEnvelope />
            </div>

            <div>
              <h4>{formData.email}</h4>
              <p>1 month ago</p>
            </div>
          </div>

          <button type="button" className="student-update-btn">
            Update
          </button>
        </div>
      </main>

      <StudentFooter />
    </div>
  );
}

export default StudentProfile;