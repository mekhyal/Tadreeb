import React, { useEffect, useRef, useState } from "react";
import { FaEnvelope, FaUserCircle } from "react-icons/fa";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalTopbar from "../../components/portal/PortalTopbar";
import { useAuth } from "../../context/AuthContext";
import { getCompanyProfile, updateCompanyProfile } from "../../api/authAPI";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIREMENTS_MESSAGE,
  isPasswordStrong,
} from "../../utils/passwordRules";

const LIMITS = {
  companyName: 100,
  industry: 80,
  phone: 20,
  website: 150,
  companySize: 30,
  location: 80,
  foundedYear: 4,
  contactPerson: 80,
  passwordMin: PASSWORD_MIN_LENGTH,
  passwordMax: PASSWORD_MAX_LENGTH,
};

const URL_REGEX =
  /^(https?:\/\/)?([A-Za-z0-9-]+\.)+[A-Za-z]{2,}(\/[^\s]*)?$/;

const emptyForm = () => ({
  companyName: "",
  companyId: "",
  industry: "",
  phone: "",
  website: "",
  companySize: "",
  location: "",
  foundedYear: "",
  contactPerson: "",
  internshipAvailability: "Open",
  email: "",
  password: "",
});

function mapCompanyToForm(c) {
  const jr = (c.joinReason || "").trim();
  const internshipAvailability = jr === "Open" || jr === "Closed" ? jr : "Open";
  return {
    companyName: c.companyName || "",
    companyId: c.id != null ? String(c.id) : "",
    industry: c.industry || "",
    phone: c.phone || "",
    website: c.website || "",
    companySize: c.size || "",
    location: c.location || "",
    foundedYear:
      c.foundedYear != null && c.foundedYear !== ""
        ? String(c.foundedYear)
        : "",
    contactPerson: c.contactPerson || "",
    internshipAvailability,
    email: c.email || "",
    password: "",
  };
}

function CompanyProfile() {
  const { user, updateUser } = useAuth();
  const joinReasonSnapshot = useRef("");

  const [showSaved, setShowSaved] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  const companyNavItems = [
    { key: "dashboard", label: "Dashboard", path: "/company/dashboard" },
    { key: "programs", label: "Programs", path: "/company/programs" },
    { key: "participants", label: "Participants", path: "/company/participants" },
  ];

  useEffect(() => {
    if (!user || user.role !== "company") return undefined;

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const res = await getCompanyProfile();
        const c = res.data.company;
        if (cancelled) return;
        joinReasonSnapshot.current = (c.joinReason || "").trim();
        setFormData(mapCompanyToForm(c));
        updateUser({ ...user, ...c });
      } catch (e) {
        if (!cancelled) {
          setLoadError(
            e.response?.data?.message || "Could not load profile from server."
          );
          joinReasonSnapshot.current = (user.joinReason || "").trim();
          setFormData(mapCompanyToForm(user));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

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

    if (formData.password.trim()) {
      if (!isPasswordStrong(formData.password)) {
        nextErrors.password = PASSWORD_REQUIREMENTS_MESSAGE;
      }
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

  const handleSave = async () => {
    if (!validateForm() || !user) return;

    setIsSaving(true);
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      const payload = {
        companyName: formData.companyName.trim(),
        industry: formData.industry.trim(),
        phone: formData.phone.trim(),
        website: formData.website.trim(),
        size: formData.companySize.trim(),
        location: formData.location.trim(),
        contactPerson: formData.contactPerson.trim(),
        foundedYear: formData.foundedYear.trim(),
      };

      const snap = (joinReasonSnapshot.current || "").trim();
      if (snap === "" || snap === "Open" || snap === "Closed") {
        payload.joinReason = formData.internshipAvailability;
      }

      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      const res = await updateCompanyProfile(payload);
      const c = res.data.company;
      joinReasonSnapshot.current = (c.joinReason || "").trim();
      setFormData((prev) => ({ ...mapCompanyToForm(c), password: "" }));
      updateUser({ ...user, ...c });
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general:
          err.response?.data?.message ||
          "Could not save profile. Please try again.",
      }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PortalLayout
      activeKey="profile"
      navItems={companyNavItems}
      profilePath="/company/profile"
    >
      <PortalTopbar
        title="Profile"
        accountLabel={formData.companyName || user?.email || "Company"}
      />

      {showSaved && (
        <div className="portal-save-toast">
          <div className="portal-save-toast__content">
            Profile changes saved successfully.
          </div>
          <div className="portal-save-toast__progress"></div>
        </div>
      )}

      <section className="portal-panel company-profile-section">
        {loadError && (
          <p className="company-form-error" style={{ marginBottom: "1rem" }}>
            {loadError}
          </p>
        )}

        <div className="company-profile-header">
          <div className="company-profile-user">
            <div className="company-profile-avatar">
              <FaUserCircle />
            </div>

            <div>
              <h2>{formData.companyName || "—"}</h2>
              <p>{formData.email}</p>
            </div>
          </div>

          {errors.general && (
            <p className="company-form-error" style={{ marginRight: "auto" }}>
              {errors.general}
            </p>
          )}

          <button
            type="button"
            className="company-save-btn"
            onClick={handleSave}
            disabled={isLoading || isSaving}
          >
            {isSaving ? "Saving..." : "Save Change"}
          </button>
        </div>

        {isLoading ? (
          <p>Loading profile…</p>
        ) : (
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
              readOnly
              aria-readonly="true"
            />
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
            <label>Password</label>
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              maxLength={LIMITS.passwordMax}
            />
            {errors.password && (
              <p className="company-form-error">{errors.password}</p>
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
        )}

        <div className="company-email-section">
          <h3>Official Email</h3>

          <div className="company-email-card">
            <div className="company-email-icon">
              <FaEnvelope />
            </div>

            <div>
              <h4>{formData.email}</h4>
              <p>Contact support to change your login email.</p>
            </div>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
}

export default CompanyProfile;
