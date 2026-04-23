import React, { useState } from "react";
import { FaEnvelope, FaUserCircle } from "react-icons/fa";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalTopbar from "../../components/portal/PortalTopbar";
import { companyProfileData } from "../../data/companyData";

function CompanyProfile() {
  const [showSaved, setShowSaved] = useState(false);
  const [formData, setFormData] = useState(companyProfileData);
  const companyNavItems = [
  { key: "dashboard", label: "Dashboard", path: "/company/dashboard" },
  { key: "programs", label: "Programs", path: "/company/programs" },
  { key: "participants", label: "Participants", path: "/company/participants" },
  ];


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <PortalLayout activeKey="profile" navItems={companyNavItems} profilePath="/company/profile">
      <PortalTopbar title="Profile" companyName="Creative Tech" />

      {showSaved && (
        <div className="portal-save-toast">
          <div className="portal-save-toast__content">
            Profile changes saved successfully.
          </div>
          <div className="portal-save-toast__progress"></div>
        </div>
      )}

      <section className="portal-panel company-profile-section">
        <div className="company-profile-header">
          <div className="company-profile-user">
            <div className="company-profile-avatar">
              <FaUserCircle />
            </div>

            <div>
              <h2>{formData.companyName}</h2>
              <p>{formData.email}</p>
            </div>
          </div>

          <button type="button" className="company-save-btn" onClick={handleSave}>
            Save Change
          </button>
        </div>

        <div className="company-profile-grid">
          <div className="company-form-group">
            <label>Company Name</label>
            <input name="companyName" value={formData.companyName} onChange={handleChange} />
          </div>

          <div className="company-form-group">
            <label>Company ID</label>
            <input name="companyId" value={formData.companyId} onChange={handleChange} />
          </div>

          <div className="company-form-group">
            <label>Industry</label>
            <input name="industry" value={formData.industry} onChange={handleChange} />
          </div>

          <div className="company-form-group">
            <label>Phone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="company-form-group">
            <label>Website</label>
            <input name="website" value={formData.website} onChange={handleChange} />
          </div>

          <div className="company-form-group">
            <label>Company Size</label>
            <input name="companySize" value={formData.companySize} onChange={handleChange} />
          </div>

          <div className="company-form-group">
            <label>Location</label>
            <input name="location" value={formData.location} onChange={handleChange} />
          </div>

          <div className="company-form-group">
            <label>Founded Year</label>
            <input name="foundedYear" value={formData.foundedYear} onChange={handleChange} />
          </div>

          <div className="company-form-group">
            <label>HR / Contact Person Name</label>
            <input name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
          </div>

          <div className="company-form-group">
            <label>Internship Availability</label>
            <select
              name="internshipAvailability"
              value={formData.internshipAvailability}
              onChange={handleChange}
            >
              <option>Open</option>
              <option>Closed</option>
            </select>
          </div>
        </div>

        <div className="company-email-section">
          <h3>Official Email</h3>

          <div className="company-email-card">
            <div className="company-email-icon">
              <FaEnvelope />
            </div>

            <div>
              <h4>{formData.email}</h4>
              <p>1 month ago</p>
            </div>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
}

export default CompanyProfile;