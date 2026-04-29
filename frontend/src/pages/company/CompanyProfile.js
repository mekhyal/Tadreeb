import React, { useEffect, useMemo, useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
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
  companyName: 200,
  industry: 100,
  phone: 20,
  website: 200,
  companySize: 50,
  location: 100,
  foundedYear: 4,
  contactPerson: 100,
  passwordMin: PASSWORD_MIN_LENGTH,
  passwordMax: PASSWORD_MAX_LENGTH,
};

const INDUSTRY_OPTIONS = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Other",
];
const COMPANY_SIZE_OPTIONS = ["1-10", "11-50", "51-200", "201-500", "500+"];
const FOUNDED_YEAR_OPTIONS = Array.from(
  { length: new Date().getFullYear() - 1799 },
  (_, index) => String(new Date().getFullYear() - index)
);

const PHONE_REGEX = /^[+0-9\s\-()]{7,20}$/;
const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;

const emptyForm = () => ({
  companyName: "",
  industry: "",
  phone: "",
  website: "",
  companySize: "",
  location: "",
  foundedYear: "",
  contactPerson: "",
  email: "",
  password: "",
});

function mapCompanyToForm(c = {}) {
  return {
    companyName: c.companyName || "",
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
    email: c.email || "",
    password: "",
  };
}

function CompanyProfile() {
  const { user, updateUser } = useAuth();

  const [savedCompany, setSavedCompany] = useState(user || {});
  const [showSaved, setShowSaved] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        const company = res.data.company;
        if (cancelled) return;
        setSavedCompany(company);
        setFormData(mapCompanyToForm(company));
        updateUser({ ...user, ...company });
      } catch (e) {
        if (!cancelled) {
          setLoadError(
            e.response?.data?.message || "Could not load profile from server."
          );
          setSavedCompany(user);
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

  const savedForm = useMemo(() => mapCompanyToForm(savedCompany), [savedCompany]);

  const hasChanges =
    Boolean(formData.password.trim()) ||
    formData.companyName !== savedForm.companyName ||
    formData.industry !== savedForm.industry ||
    formData.phone !== savedForm.phone ||
    formData.website !== savedForm.website ||
    formData.companySize !== savedForm.companySize ||
    formData.location !== savedForm.location ||
    formData.foundedYear !== savedForm.foundedYear ||
    formData.contactPerson !== savedForm.contactPerson;

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
    } else if (formData.companyName.trim().length < 3) {
      nextErrors.companyName = "Company name must be at least 3 characters.";
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
    } else if (!PHONE_REGEX.test(formData.phone.trim())) {
      nextErrors.phone = "Please enter a valid phone number.";
    }

    if (formData.website.trim() && !URL_REGEX.test(formData.website.trim())) {
      nextErrors.website = "Please enter a valid website URL.";
    } else {
      checkLength("website", "Website", LIMITS.website, nextErrors);
    }

    if (!formData.companySize.trim()) {
      nextErrors.companySize = "Company size is required.";
    }

    if (!formData.location.trim()) {
      nextErrors.location = "Location is required.";
    } else if (formData.location.trim().length < 3) {
      nextErrors.location = "Location must be at least 3 characters.";
    } else {
      checkLength("location", "Location", LIMITS.location, nextErrors);
    }

    if (formData.foundedYear.trim()) {
      const year = Number(formData.foundedYear);
      if (!Number.isInteger(year) || year < 1800 || year > currentYear) {
        nextErrors.foundedYear = `Year must be between 1800 and ${currentYear}.`;
      }
    }

    if (!formData.contactPerson.trim()) {
      nextErrors.contactPerson = "Contact person name is required.";
    } else if (formData.contactPerson.trim().length < 3) {
      nextErrors.contactPerson =
        "Contact person name must be at least 3 characters.";
    } else {
      checkLength(
        "contactPerson",
        "Contact person",
        LIMITS.contactPerson,
        nextErrors
      );
    }

    if (formData.password.trim() && !isPasswordStrong(formData.password)) {
      nextErrors.password = PASSWORD_REQUIREMENTS_MESSAGE;
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
      general: "",
    }));
  };

  const handleSave = async () => {
    if (!hasChanges || !validateForm() || !user) return;

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

      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      const res = await updateCompanyProfile(payload);
      const company = res.data.company;
      setSavedCompany(company);
      setFormData({ ...mapCompanyToForm(company), password: "" });
      updateUser({ ...user, ...company });
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 5000);
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
        accountLabel={savedCompany.companyName || user?.email || "Company"}
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
              <h2>{savedCompany.companyName || "Company"}</h2>
              <p>{savedCompany.email || formData.email}</p>
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
            disabled={isLoading || isSaving || !hasChanges}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {isLoading ? (
          <p>Loading profile...</p>
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
              <label>Industry</label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
              >
                <option value="">Select industry</option>
                {INDUSTRY_OPTIONS.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
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
              {errors.phone && (
                <p className="company-form-error">{errors.phone}</p>
              )}
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
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
              >
                <option value="">Select company size</option>
                {COMPANY_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
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
              <select
                name="foundedYear"
                value={formData.foundedYear}
                onChange={handleChange}
              >
                <option value="">Select founded year</option>
                {FOUNDED_YEAR_OPTIONS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
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

            <div className="company-form-group company-password-field">
              <label>Password</label>
              <div className="company-password-wrap">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                  maxLength={LIMITS.passwordMax}
                />
                <button
                  type="button"
                  className="profile-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="company-form-error">{errors.password}</p>
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
              <p>Company email cannot be changed from the profile page.</p>
            </div>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
}

export default CompanyProfile;
