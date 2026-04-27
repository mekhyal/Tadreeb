import React, { useEffect, useState } from "react";
import { FaEnvelope, FaUserCircle } from "react-icons/fa";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalTopbar from "../../components/portal/PortalTopbar";
import { useAuth } from "../../context/AuthContext";
import { getAdminProfile, updateAdminProfile } from "../../api/authAPI";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIREMENTS_MESSAGE,
  isPasswordStrong,
} from "../../utils/passwordRules";

const LIMITS = {
  firstName: 50,
  lastName: 50,
  phone: 30,
  jobTitle: 100,
  country: 80,
  passwordMin: PASSWORD_MIN_LENGTH,
  passwordMax: PASSWORD_MAX_LENGTH,
};

const adminNavItems = [
  { key: "dashboard", label: "Dashboard", path: "/admin/dashboard" },
  { key: "programs", label: "Programs", path: "/admin/programs" },
  { key: "participants", label: "Participants", path: "/admin/participants" },
  { key: "companies", label: "Companies", path: "/admin/companies" },
  { key: "users", label: "Users", path: "/admin/users" },
];

const emptyForm = () => ({
  firstName: "",
  lastName: "",
  gender: "Male",
  phone: "",
  password: "",
  language: "English",
  adminId: "",
  jobTitle: "",
  country: "",
  email: "",
});

function mapAdminToForm(a) {
  return {
    firstName: a.firstName || "",
    lastName: a.lastName || "",
    gender: a.gender && a.gender !== "" ? a.gender : "Male",
    phone: a.phone || "",
    password: "",
    language: a.language && a.language !== "" ? a.language : "English",
    adminId: a.id != null ? String(a.id) : "",
    jobTitle: a.jobTitle || "",
    country: a.country || "",
    email: a.email || "",
  };
}

function AdminProfile() {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState(emptyForm);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const displayName = `${formData.firstName} ${formData.lastName}`.trim() || "Admin";

  useEffect(() => {
    if (!user || user.role !== "admin") return undefined;

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await getAdminProfile();
        const a = res.data.admin;
        if (cancelled) return;
        setFormData(mapAdminToForm(a));
        updateUser({
          ...user,
          ...a,
          name: `${a.firstName || ""} ${a.lastName || ""}`.trim(),
        });
      } catch (e) {
        if (!cancelled) {
          setError(
            e.response?.data?.message || "Could not load profile from server."
          );
          setFormData(mapAdminToForm(user));
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

  const validate = () => {
    const next = {};
    if (!formData.firstName.trim()) {
      next.firstName = "First name is required.";
    } else {
      checkLength("firstName", "First name", LIMITS.firstName, next);
    }
    if (!formData.lastName.trim()) {
      next.lastName = "Last name is required.";
    } else {
      checkLength("lastName", "Last name", LIMITS.lastName, next);
    }
    if (!formData.phone.trim()) {
      next.phone = "Phone is required.";
    } else {
      checkLength("phone", "Phone", LIMITS.phone, next);
    }
    if (formData.jobTitle.trim()) {
      checkLength("jobTitle", "Job title", LIMITS.jobTitle, next);
    }
    if (formData.country.trim()) {
      checkLength("country", "Country", LIMITS.country, next);
    }
    if (!formData.gender) {
      next.gender = "Gender is required.";
    }
    if (formData.password.trim()) {
      if (!isPasswordStrong(formData.password)) {
        next.password = PASSWORD_REQUIREMENTS_MESSAGE;
      }
    }
    return next;
  };

  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = async () => {
    const nextErrors = validate();
    setFieldErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean) || !user) return;

    setIsSaving(true);
    setError("");

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        jobTitle: formData.jobTitle.trim(),
        gender: formData.gender,
        country: formData.country.trim(),
        language: formData.language,
      };
      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      const res = await updateAdminProfile(payload);
      const a = res.data.admin;
      const name = `${a.firstName || ""} ${a.lastName || ""}`.trim();
      setFormData((prev) => ({ ...mapAdminToForm(a), password: "" }));
      updateUser({ ...user, ...a, name });
      setToast("Profile changes saved successfully.");
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not save profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PortalLayout
      activeKey="profile"
      navItems={adminNavItems}
      profilePath="/admin/profile"
    >
      <PortalTopbar title="Profile" accountLabel={displayName} />

      {toast && (
        <div className="portal-save-toast">
          <div className="portal-save-toast__content">{toast}</div>
          <div className="portal-save-toast__progress"></div>
        </div>
      )}

      <section className="portal-panel admin-profile-page">
        {error && (
          <p className="company-form-error" style={{ marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        <div className="admin-profile-top">
          <div className="admin-profile-heading">
            <h2>Welcome, {displayName}</h2>

            <div className="admin-profile-user">
              <div className="admin-profile-avatar">
                <FaUserCircle />
              </div>

              <div>
                <h3>{displayName}</h3>
                <p>{formData.email}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="admin-profile-save-btn"
            onClick={handleSave}
            disabled={isLoading || isSaving}
          >
            {isSaving ? "Saving..." : "Save Change"}
          </button>
        </div>

        {isLoading ? (
          <p>Loading profile…</p>
        ) : (
        <div className="admin-profile-form-grid">
          <div className="admin-profile-field">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              maxLength={LIMITS.firstName}
            />
            {fieldErrors.firstName && (
              <p className="company-form-error">{fieldErrors.firstName}</p>
            )}
          </div>

          <div className="admin-profile-field">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              maxLength={LIMITS.lastName}
            />
            {fieldErrors.lastName && (
              <p className="company-form-error">{fieldErrors.lastName}</p>
            )}
          </div>

          <div className="admin-profile-field">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {fieldErrors.gender && (
              <p className="company-form-error">{fieldErrors.gender}</p>
            )}
          </div>

          <div className="admin-profile-field">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength={LIMITS.phone}
            />
            {fieldErrors.phone && (
              <p className="company-form-error">{fieldErrors.phone}</p>
            )}
          </div>

          <div className="admin-profile-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current"
              maxLength={LIMITS.passwordMax}
            />
            {fieldErrors.password && (
              <p className="company-form-error">{fieldErrors.password}</p>
            )}
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
              readOnly
              aria-readonly="true"
            />
          </div>

          <div className="admin-profile-field">
            <label>Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              maxLength={LIMITS.jobTitle}
            />
            {fieldErrors.jobTitle && (
              <p className="company-form-error">{fieldErrors.jobTitle}</p>
            )}
          </div>

          <div className="admin-profile-field">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              maxLength={LIMITS.country}
            />
            {fieldErrors.country && (
              <p className="company-form-error">{fieldErrors.country}</p>
            )}
          </div>
        </div>
        )}

        <div className="admin-profile-email-card">
          <h4>My Email Address</h4>

          <div className="admin-profile-email-row">
            <div className="admin-profile-email-icon">
              <FaEnvelope />
            </div>

            <div>
              <strong>{formData.email}</strong>
              <p>Contact support to change your login email.</p>
            </div>
          </div>

          <button type="button" className="admin-profile-email-btn" disabled>
            Update
          </button>
        </div>
      </section>
    </PortalLayout>
  );
}

export default AdminProfile;
