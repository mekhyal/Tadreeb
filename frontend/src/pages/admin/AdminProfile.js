import React, { useState } from "react";
import { FaEnvelope, FaUserCircle } from "react-icons/fa";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalTopbar from "../../components/portal/PortalTopbar";
import { adminProfileData } from "../../data/adminData";

const adminNavItems = [
  { key: "dashboard", label: "Dashboard", path: "/admin/dashboard" },
  { key: "programs", label: "Programs", path: "/admin/programs" },
  { key: "participants", label: "Participants", path: "/admin/participants" },
  { key: "companies", label: "Companies", path: "/admin/companies" },
  { key: "users", label: "Users", path: "/admin/users" },
];

function AdminProfile() {
  const [formData, setFormData] = useState(adminProfileData);
  const [toast, setToast] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setToast("Profile changes saved successfully.");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <PortalLayout
      activeKey="profile"
      navItems={adminNavItems}
      profilePath="/admin/profile"
    >
      <PortalTopbar title="Profile" companyName={formData.name} />

      {toast && (
        <div className="portal-save-toast">
          <div className="portal-save-toast__content">{toast}</div>
          <div className="portal-save-toast__progress"></div>
        </div>
      )}

      <section className="portal-panel admin-profile-page">
        <div className="admin-profile-top">
          <div className="admin-profile-heading">
            <h2>Welcome, {formData.name}</h2>

            <div className="admin-profile-user">
              <div className="admin-profile-avatar">
                <FaUserCircle />
              </div>

              <div>
                <h3>{formData.name}</h3>
                <p>{formData.email}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="admin-profile-save-btn"
            onClick={handleSave}
          >
            Save Change
          </button>
        </div>

        <div className="admin-profile-form-grid">
          <div className="admin-profile-field">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="admin-profile-field">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="admin-profile-field">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="admin-profile-field">
            <label>Password</label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="admin-profile-field">
            <label>Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="English">English</option>
              <option value="Arabic">Arabic</option>
            </select>
          </div>

          <div className="admin-profile-field">
            <label>Admin ID</label>
            <input
              type="text"
              name="adminId"
              value={formData.adminId}
              onChange={handleChange}
            />
          </div>

          <div className="admin-profile-field">
            <label>Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
            />
          </div>

          <div className="admin-profile-field">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="admin-profile-email-card">
          <h4>My Email Address</h4>

          <div className="admin-profile-email-row">
            <div className="admin-profile-email-icon">
              <FaEnvelope />
            </div>

            <div>
              <strong>{formData.email}</strong>
              <p>1 month ago</p>
            </div>
          </div>

          <button type="button" className="admin-profile-email-btn">
            Update
          </button>
        </div>
      </section>
    </PortalLayout>
  );
}

export default AdminProfile;