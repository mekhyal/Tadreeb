import React, { useState } from "react";
import { FaEnvelope, FaUserCircle } from "react-icons/fa";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalTopbar from "../../components/portal/PortalTopbar";
import { companyProfileData } from "../../data/companyData";

const LIMITS = {
  companyName: 100,
  companyId: 30,
  industry: 80,
  phone: 20,
  website: 150,
  companySize: 30,
  location: 80,
  foundedYear: 4,
  contactPerson: 80,
};

const URL_REGEX =
  /^(https?:\/\/)?([A-Za-z0-9-]+\.)+[A-Za-z]{2,}(\/[^\s]*)?$/;

function CompanyProfile() {
  const [showSaved, setShowSaved] = useState(false);
  const [formData, setFormData] = useState(companyProfileData);
  const [errors, setErrors] = useState({});

  const companyNavItems = [
    { key: "dashboard", label: "Dashboard", path: "/company/dashboard" },
    { key: "programs", label: "Programs", path: "/company/programs" },
    { key: "participants", label: "Participants", path: "/company/participants" },
  ];

  const checkLength = (field, label, limit, nextErrors) => {
    if (String(formData[field] || "").trim().length > limit) {
      nextErrors[field] = `${label} must be ${limit} characters or less.`;
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    const currentYear = new Date().getFullYear();

    if (!formData.companyName.trim()) {
      nextErrors.companyName = "Company name is required.";
    } else {
      checkLength("companyName", "Company name", LIMITS.companyName, nextErrors);
    }

    if (!formData.companyId.trim()) {
      nextErrors.companyId = "Company ID is required.";
    } else {
      checkLength("companyId", "Company ID", LIMITS.companyId, nextErrors);
    }

    if (!formData.industry.trim()) {
      nextErrors.industry = "Industry is required.";
    } else {
      checkLength("industry", "Industry", LIMITS.industry, nextErrors);
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = "Phone is required.";
    } else if (formData.phone.trim().length < 7) {
      nextErrors.phone = "Phone must be at least 7 characters.";
    } else {
      checkLength("phone", "Phone", LIMITS.phone, nextErrors);
    }

    if (!formData.website.trim()) {
      nextErrors.website = "Website is required.";
    } else if (!URL_REGEX.test(formData.website.trim())) {
      nextErrors.website = "Please enter a valid website.";
    } else {
      checkLength("website", "Website", LIMITS.website, nextErrors);
    }

    if (!formData.companySize.trim()) {
      nextErrors.companySize = "Company size is required.";
    } else {
      checkLength("companySize", "Company size", LIMITS.companySize, nextErrors);
    }

    if (!formData.location.trim()) {
      nextErrors.location = "Location is required.";
    } else {
      checkLength("location", "Location", LIMITS.location, nextErrors);
    }

    if (!String(formData.foundedYear).trim()) {
      nextErrors.foundedYear = "Founded year is required.";
    } else if (
      Number.isNaN(Number(formData.foundedYear)) ||
      Number(formData.foundedYear) < 1900 ||
      Number(formData.foundedYear) > currentYear
    ) {
      nextErrors.foundedYear = "Enter a valid founded year.";
    }

    if (!formData.contactPerson.trim()) {
      nextErrors.contactPerson = "Contact person is required.";
    } else {
      checkLength(
        "contactPerson",
        "Contact person",
        LIMITS.contactPerson,
        nextErrors
      );
    }

    if (!formData.internshipAvailability) {
      nextErrors.internshipAvailability = "Internship availability is required.";
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

    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <PortalLayout
      activeKey="profile"
      navItems={companyNavItems}
      profilePath="/company/profile"
    >
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
            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              maxLength={LIMITS.companyName}
            />
            {errors.companyName && (
              <p className="company-form-error">{errors.companyName}</p>
            )}
          </div>

          <div className="company-form-group">
            <label>Company ID</label>
            <input
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              maxLength={LIMITS.companyId}
            />
            {errors.companyId && (
              <p className="company-form-error">{errors.companyId}</p>
            )}
          </div>

          <div className="company-form-group">
            <label>Industry</label>
            <input
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              maxLength={LIMITS.industry}
            />
            {errors.industry && (
              <p className="company-form-error">{errors.industry}</p>
            )}
          </div>

          <div className="company-form-group">
            <label>Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength={LIMITS.phone}
            />
            {errors.phone && <p className="company-form-error">{errors.phone}</p>}
          </div>

          <div className="company-form-group">
            <label>Website</label>
            <input
              name="website"
              value={formData.website}
              onChange={handleChange}
              maxLength={LIMITS.website}
              placeholder="https://company.com"
            />
            {errors.website && (
              <p className="company-form-error">{errors.website}</p>
            )}
          </div>

          <div className="company-form-group">
            <label>Company Size</label>
            <input
              name="companySize"
              value={formData.companySize}
              onChange={handleChange}
              maxLength={LIMITS.companySize}
            />
            {errors.companySize && (
              <p className="company-form-error">{errors.companySize}</p>
            )}
          </div>

          <div className="company-form-group">
            <label>Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              maxLength={LIMITS.location}
            />
            {errors.location && (
              <p className="company-form-error">{errors.location}</p>
            )}
          </div>

          <div className="company-form-group">
            <label>Founded Year</label>
            <input
              name="foundedYear"
              value={formData.foundedYear}
              onChange={handleChange}
              maxLength={LIMITS.foundedYear}
            />
            {errors.foundedYear && (
              <p className="company-form-error">{errors.foundedYear}</p>
            )}
          </div>

          <div className="company-form-group">
            <label>HR / Contact Person Name</label>
            <input
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              maxLength={LIMITS.contactPerson}
            />
            {errors.contactPerson && (
              <p className="company-form-error">{errors.contactPerson}</p>
            )}
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
            {errors.internshipAvailability && (
              <p className="company-form-error">
                {errors.internshipAvailability}
              </p>
            )}
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