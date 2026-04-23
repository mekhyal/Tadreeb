import React, { useEffect, useState } from "react";

const initialErrors = {
  name: "",
  email: "",
  role: "",
  status: "",
  phone: "",
  location: "",
};

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

function AdminUserModal({ onClose, onSave, existingUsers = [] }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "Active",
    phone: "",
    location: "",
    extraInfo: "",
  });

  const [errors, setErrors] = useState(initialErrors);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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

  const generateSystemId = () => {
    const maxId = existingUsers.reduce((max, user) => {
      const numeric = Number(String(user.systemId || "").replace("USR-", ""));
      return Number.isNaN(numeric) ? max : Math.max(max, numeric);
    }, 1000);

    return `USR-${maxId + 1}`;
  };

  const validateForm = () => {
    const nextErrors = { ...initialErrors };

    if (!formData.name.trim()) {
      nextErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 3) {
      nextErrors.name = "Name must be at least 3 characters.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      nextErrors.email = "Please enter a valid email.";
    }

    if (!formData.role.trim()) {
      nextErrors.role = "Role is required.";
    }

    if (!formData.status.trim()) {
      nextErrors.status = "Status is required.";
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = "Phone is required.";
    } else if (formData.phone.trim().length < 7) {
      nextErrors.phone = "Phone must be at least 7 characters.";
    }

    if (!formData.location.trim()) {
      nextErrors.location = "Location is required.";
    } else if (formData.location.trim().length < 3) {
      nextErrors.location = "Location must be at least 3 characters.";
    }

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const baseUser = {
      ...formData,
      extraInfo: formData.role === "Admin" ? formData.extraInfo : "",
      id: Date.now(),
      systemId: generateSystemId(),
      createdAt: new Date().toISOString().slice(0, 10),
    };

    let roleFields = {};

    if (formData.role === "Student") {
      roleFields = {
        studentId: `STU-${Date.now().toString().slice(-4)}`,
        universityName: "",
        major: "",
        year: "",
        gender: "",
        country: "",
        skills: "",
      };
    } else if (formData.role === "Company") {
      roleFields = {
        companyId: `COM-${Date.now().toString().slice(-4)}`,
        industry: "",
        website: "",
        companySize: "",
        foundedYear: "",
        contactPerson: "",
        internshipAvailability: "Open",
      };
    } else if (formData.role === "Admin") {
      roleFields = {
        adminId: `ADM-${Date.now().toString().slice(-3)}`,
        gender: "",
        country: "",
        language: "",
        jobTitle: "",
      };
    }

    onSave({
      ...baseUser,
      ...roleFields,
    });
  };

  return (
    <div className="company-modal-overlay" onClick={onClose}>
      <div
        className="company-modal-card compact"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="company-modal-head">
          <h2>Add New User</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="company-form company-form-scroll"
          noValidate
        >
          <div className="company-form-grid">
            <div className="company-form-group">
              <label>Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: Abdulaziz"
              />
              {errors.name && (
                <p className="company-form-error">{errors.name}</p>
              )}
            </div>

            <div className="company-form-group">
              <label>Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Example: user@email.com"
              />
              {errors.email && (
                <p className="company-form-error">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="company-form-grid">
            <div className="company-form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="">Select role</option>
                <option value="Student">Student</option>
                <option value="Company">Company</option>
                <option value="Admin">Admin</option>
              </select>
              {errors.role && (
                <p className="company-form-error">{errors.role}</p>
              )}
            </div>

            <div className="company-form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
              {errors.status && (
                <p className="company-form-error">{errors.status}</p>
              )}
            </div>
          </div>

          <div className="company-form-grid">
            <div className="company-form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Example: +965 9999 1111"
              />
              {errors.phone && (
                <p className="company-form-error">{errors.phone}</p>
              )}
            </div>

            <div className="company-form-group">
              <label>Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Example: Kuwait"
              />
              {errors.location && (
                <p className="company-form-error">{errors.location}</p>
              )}
            </div>
          </div>

          {formData.role === "Admin" && (
            <div className="company-form-group full">
              <label>Additional Info</label>
              <textarea
                rows="4"
                name="extraInfo"
                value={formData.extraInfo}
                onChange={handleChange}
                placeholder="Optional note or description about this admin."
              ></textarea>
            </div>
          )}

          <div className="company-form-actions">
            <button type="button" className="secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary">
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminUserModal;