import React, { useEffect, useMemo, useState } from "react";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIREMENTS_MESSAGE,
  isPasswordStrong,
} from "../../utils/passwordRules";

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const LIMITS = {
  name: 80,
  email: 120,
  passwordMin: PASSWORD_MIN_LENGTH,
  passwordMax: PASSWORD_MAX_LENGTH,
  phone: 20,
  location: 80,
  universityName: 100,
  major: 80,
  country: 80,
  skills: 150,
  industry: 80,
  website: 150,
  companySize: 30,
  foundedYear: 4,
  contactPerson: 80,
  jobTitle: 80,
  extraInfo: 250,
};

const baseInitialErrors = {
  role: "",
  name: "",
  email: "",
  status: "",
  phone: "",
  location: "",
  password: "",
};

function AdminUserModal({ onClose, onSave, existingUsers = [] }) {
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    status: "Active",
    phone: "",
    location: "",

    universityName: "",
    major: "",
    year: "",
    gender: "",
    country: "",
    skills: "",

    industry: "",
    website: "",
    companySize: "",
    foundedYear: "",
    contactPerson: "",
    internshipAvailability: "Open",

    language: "",
    jobTitle: "",
    extraInfo: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const modalTitle = useMemo(() => {
    if (!formData.role) return "Add New User";
    return `Add New ${formData.role}`;
  }, [formData.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "role") {
        if (value === "Company" && prev.status === "Inactive") {
          next.status = "Pending";
        }
        if ((value === "Student" || value === "Admin") && prev.status === "Rejected") {
          next.status = "Pending";
        }
      }
      return next;
    });

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

  const generateRoleId = (prefix) => {
    return `${prefix}-${Date.now().toString().slice(-5)}`;
  };

  const checkMax = (field, label, limit, nextErrors) => {
    if (formData[field]?.trim().length > limit) {
      nextErrors[field] = `${label} must be ${limit} characters or less.`;
    }
  };

  const validateBaseFields = (nextErrors) => {
    if (!formData.role) {
      nextErrors.role = "Role is required.";
    }

    if (!formData.name.trim()) {
      nextErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 3) {
      nextErrors.name = "Name must be at least 3 characters.";
    } else {
      checkMax("name", "Name", LIMITS.name, nextErrors);
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      nextErrors.email = "Please enter a valid email.";
    } else {
      checkMax("email", "Email", LIMITS.email, nextErrors);
    }

    if (!formData.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (!isPasswordStrong(formData.password)) {
      nextErrors.password = PASSWORD_REQUIREMENTS_MESSAGE;
    }

    if (!formData.status.trim()) {
      nextErrors.status = "Status is required.";
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = "Phone is required.";
    } else if (formData.phone.trim().length < 7) {
      nextErrors.phone = "Phone must be at least 7 characters.";
    } else {
      checkMax("phone", "Phone", LIMITS.phone, nextErrors);
    }

    if (!formData.location.trim()) {
      nextErrors.location = "Location is required.";
    } else if (formData.location.trim().length < 3) {
      nextErrors.location = "Location must be at least 3 characters.";
    } else {
      checkMax("location", "Location", LIMITS.location, nextErrors);
    }
  };

  const validateStudentFields = (nextErrors) => {
    if (!formData.universityName.trim()) {
      nextErrors.universityName = "University name is required.";
    } else {
      checkMax("universityName", "University name", LIMITS.universityName, nextErrors);
    }

    if (!formData.major.trim()) {
      nextErrors.major = "Major is required.";
    } else {
      checkMax("major", "Major", LIMITS.major, nextErrors);
    }

    if (!formData.year) {
      nextErrors.year = "Year is required.";
    }

    if (!formData.gender) {
      nextErrors.gender = "Gender is required.";
    }

    if (!formData.country.trim()) {
      nextErrors.country = "Country is required.";
    } else {
      checkMax("country", "Country", LIMITS.country, nextErrors);
    }

    if (!formData.skills.trim()) {
      nextErrors.skills = "Skills are required.";
    } else {
      checkMax("skills", "Skills", LIMITS.skills, nextErrors);
    }
  };

  const validateCompanyFields = (nextErrors) => {
    if (!formData.industry.trim()) {
      nextErrors.industry = "Industry is required.";
    } else {
      checkMax("industry", "Industry", LIMITS.industry, nextErrors);
    }

    if (!formData.website.trim()) {
      nextErrors.website = "Website is required.";
    } else {
      checkMax("website", "Website", LIMITS.website, nextErrors);
    }

    if (!formData.companySize.trim()) {
      nextErrors.companySize = "Company size is required.";
    }

    if (!formData.foundedYear) {
      nextErrors.foundedYear = "Founded year is required.";
    } else if (
      Number.isNaN(Number(formData.foundedYear)) ||
      Number(formData.foundedYear) < 1900 ||
      Number(formData.foundedYear) > new Date().getFullYear()
    ) {
      nextErrors.foundedYear = "Enter a valid founded year.";
    }

    if (!formData.contactPerson.trim()) {
      nextErrors.contactPerson = "Contact person is required.";
    } else {
      checkMax("contactPerson", "Contact person", LIMITS.contactPerson, nextErrors);
    }

    if (!formData.internshipAvailability) {
      nextErrors.internshipAvailability = "Internship availability is required.";
    }
  };

  const validateAdminFields = (nextErrors) => {
    if (!formData.jobTitle.trim()) {
      nextErrors.jobTitle = "Job title is required.";
    } else {
      checkMax("jobTitle", "Job title", LIMITS.jobTitle, nextErrors);
    }

    if (!formData.language) {
      nextErrors.language = "Language is required.";
    }

    if (!formData.gender) {
      nextErrors.gender = "Gender is required.";
    }

    if (!formData.country.trim()) {
      nextErrors.country = "Country is required.";
    } else {
      checkMax("country", "Country", LIMITS.country, nextErrors);
    }

    if (!formData.extraInfo.trim()) {
      nextErrors.extraInfo = "Additional info is required for admin.";
    } else {
      checkMax("extraInfo", "Additional info", LIMITS.extraInfo, nextErrors);
    }
  };

  const validateForm = () => {
    const nextErrors = { ...baseInitialErrors };

    validateBaseFields(nextErrors);

    if (formData.role === "Student") validateStudentFields(nextErrors);
    if (formData.role === "Company") validateCompanyFields(nextErrors);
    if (formData.role === "Admin") validateAdminFields(nextErrors);

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const baseUser = {
      id: Date.now(),
      systemId: generateSystemId(),
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: formData.role,
      status: formData.status,
      phone: formData.phone.trim(),
      location: formData.location.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };

    let roleFields = {};

    if (formData.role === "Student") {
      roleFields = {
        studentId: generateRoleId("STU"),
        universityName: formData.universityName.trim(),
        major: formData.major.trim(),
        year: formData.year,
        gender: formData.gender,
        country: formData.country.trim(),
        skills: formData.skills.trim(),
        extraInfo: "",
      };
    }

    if (formData.role === "Company") {
      roleFields = {
        companyId: generateRoleId("COM"),
        industry: formData.industry.trim(),
        website: formData.website.trim(),
        companySize: formData.companySize,
        foundedYear: formData.foundedYear,
        contactPerson: formData.contactPerson.trim(),
        internshipAvailability: formData.internshipAvailability,
        extraInfo: "",
      };
    }

    if (formData.role === "Admin") {
      roleFields = {
        adminId: generateRoleId("ADM"),
        jobTitle: formData.jobTitle.trim(),
        language: formData.language,
        gender: formData.gender,
        country: formData.country.trim(),
        extraInfo: formData.extraInfo.trim(),
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
        className="company-modal-card compact admin-user-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="company-modal-head">
          <h2>{modalTitle}</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-user-modal-form" noValidate>
          <div className="company-modal-body">
            <div className="admin-user-role-picker">
              <label>Choose User Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="">Select role first</option>
                <option value="Student">Student</option>
                <option value="Company">Company</option>
                <option value="Admin">Admin</option>
              </select>
              {errors.role && <p className="company-form-error">{errors.role}</p>}
            </div>

            {formData.role && (
              <div className="company-form company-form--compact">
                <div className="admin-user-section-title">
                  <h3>Basic Information</h3>
                  <p>All fields are required for the selected role.</p>
                </div>

                <div className="company-form-grid">
                  <div className="company-form-group">
                    <label>Name</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Example: Abdulaziz"
                      maxLength={LIMITS.name}
                    />
                    {errors.name && <p className="company-form-error">{errors.name}</p>}
                  </div>

                  <div className="company-form-group">
                    <label>Email</label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Example: user@email.com"
                      maxLength={LIMITS.email}
                    />
                    {errors.email && <p className="company-form-error">{errors.email}</p>}
                  </div>
                </div>

                <div className="company-form-grid">
                  <div className="company-form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="8-24 characters"
                      maxLength={LIMITS.passwordMax}
                    />
                    {errors.password && (
                      <p className="company-form-error">{errors.password}</p>
                    )}
                  </div>

                  <div className="company-form-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleChange}>
                      {formData.role === "Company" ? (
                        <>
                          <option value="Pending">Pending</option>
                          <option value="Active">Active</option>
                          <option value="Rejected">Rejected</option>
                        </>
                      ) : (
                        <>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Pending">Pending</option>
                        </>
                      )}
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
                      maxLength={LIMITS.phone}
                    />
                    {errors.phone && <p className="company-form-error">{errors.phone}</p>}
                  </div>

                  <div className="company-form-group">
                    <label>Location</label>
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Example: Kuwait"
                      maxLength={LIMITS.location}
                    />
                    {errors.location && (
                      <p className="company-form-error">{errors.location}</p>
                    )}
                  </div>
                </div>

                {formData.role === "Student" && (
                  <>
                    <div className="admin-user-section-title">
                      <h3>Student Information</h3>
                    </div>

                    <div className="company-form-grid">
                      <div className="company-form-group">
                        <label>University Name</label>
                        <input
                          name="universityName"
                          value={formData.universityName}
                          onChange={handleChange}
                          placeholder="Example: Kuwait University"
                          maxLength={LIMITS.universityName}
                        />
                        {errors.universityName && (
                          <p className="company-form-error">{errors.universityName}</p>
                        )}
                      </div>

                      <div className="company-form-group">
                        <label>Major</label>
                        <input
                          name="major"
                          value={formData.major}
                          onChange={handleChange}
                          placeholder="Example: Computer Science"
                          maxLength={LIMITS.major}
                        />
                        {errors.major && (
                          <p className="company-form-error">{errors.major}</p>
                        )}
                      </div>
                    </div>

                    <div className="company-form-grid">
                      <div className="company-form-group">
                        <label>Year</label>
                        <select name="year" value={formData.year} onChange={handleChange}>
                          <option value="">Select year</option>
                          <option value="First">First</option>
                          <option value="Second">Second</option>
                          <option value="Third">Third</option>
                          <option value="Fourth">Fourth</option>
                          <option value="Fifth">Fifth</option>
                        </select>
                        {errors.year && <p className="company-form-error">{errors.year}</p>}
                      </div>

                      <div className="company-form-group">
                        <label>Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        {errors.gender && (
                          <p className="company-form-error">{errors.gender}</p>
                        )}
                      </div>
                    </div>

                    <div className="company-form-grid">
                      <div className="company-form-group">
                        <label>Country</label>
                        <input
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          placeholder="Example: Kuwait"
                          maxLength={LIMITS.country}
                        />
                        {errors.country && (
                          <p className="company-form-error">{errors.country}</p>
                        )}
                      </div>

                      <div className="company-form-group">
                        <label>Skills</label>
                        <input
                          name="skills"
                          value={formData.skills}
                          onChange={handleChange}
                          placeholder="Example: React, CSS, UI Design"
                          maxLength={LIMITS.skills}
                        />
                        {errors.skills && (
                          <p className="company-form-error">{errors.skills}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {formData.role === "Company" && (
                  <>
                    <div className="admin-user-section-title">
                      <h3>Company Information</h3>
                    </div>

                    <div className="company-form-grid">
                      <div className="company-form-group">
                        <label>Industry</label>
                        <input
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                          placeholder="Example: Technology"
                          maxLength={LIMITS.industry}
                        />
                        {errors.industry && (
                          <p className="company-form-error">{errors.industry}</p>
                        )}
                      </div>

                      <div className="company-form-group">
                        <label>Website</label>
                        <input
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder="Example: https://company.com"
                          maxLength={LIMITS.website}
                        />
                        {errors.website && (
                          <p className="company-form-error">{errors.website}</p>
                        )}
                      </div>
                    </div>

                    <div className="company-form-grid">
                      <div className="company-form-group">
                        <label>Company Size</label>
                        <select
                          name="companySize"
                          value={formData.companySize}
                          onChange={handleChange}
                        >
                          <option value="">Select size</option>
                          <option value="1-10">1-10</option>
                          <option value="11-50">11-50</option>
                          <option value="51-200">51-200</option>
                          <option value="201-500">201-500</option>
                          <option value="500+">500+</option>
                        </select>
                        {errors.companySize && (
                          <p className="company-form-error">{errors.companySize}</p>
                        )}
                      </div>

                      <div className="company-form-group">
                        <label>Founded Year</label>
                        <input
                          name="foundedYear"
                          value={formData.foundedYear}
                          onChange={handleChange}
                          placeholder="Example: 2015"
                          maxLength={LIMITS.foundedYear}
                        />
                        {errors.foundedYear && (
                          <p className="company-form-error">{errors.foundedYear}</p>
                        )}
                      </div>
                    </div>

                    <div className="company-form-grid">
                      <div className="company-form-group">
                        <label>Contact Person</label>
                        <input
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleChange}
                          placeholder="Example: HR Manager"
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
                          <option value="Open">Open</option>
                          <option value="Closed">Closed</option>
                        </select>
                        {errors.internshipAvailability && (
                          <p className="company-form-error">
                            {errors.internshipAvailability}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {formData.role === "Admin" && (
                  <>
                    <div className="admin-user-section-title">
                      <h3>Admin Information</h3>
                    </div>

                    <div className="company-form-grid">
                      <div className="company-form-group">
                        <label>Job Title</label>
                        <input
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleChange}
                          placeholder="Example: System Administrator"
                          maxLength={LIMITS.jobTitle}
                        />
                        {errors.jobTitle && (
                          <p className="company-form-error">{errors.jobTitle}</p>
                        )}
                      </div>

                      <div className="company-form-group">
                        <label>Language</label>
                        <select name="language" value={formData.language} onChange={handleChange}>
                          <option value="">Select language</option>
                          <option value="English">English</option>
                          <option value="Arabic">Arabic</option>
                        </select>
                        {errors.language && (
                          <p className="company-form-error">{errors.language}</p>
                        )}
                      </div>
                    </div>

                    <div className="company-form-grid">
                      <div className="company-form-group">
                        <label>Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        {errors.gender && (
                          <p className="company-form-error">{errors.gender}</p>
                        )}
                      </div>

                      <div className="company-form-group">
                        <label>Country</label>
                        <input
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          placeholder="Example: Kuwait"
                          maxLength={LIMITS.country}
                        />
                        {errors.country && (
                          <p className="company-form-error">{errors.country}</p>
                        )}
                      </div>
                    </div>

                    <div className="company-form-group full">
                      <label>Additional Info</label>
                      <textarea
                        rows="4"
                        name="extraInfo"
                        value={formData.extraInfo}
                        onChange={handleChange}
                        placeholder="Example: Main system administrator."
                        maxLength={LIMITS.extraInfo}
                      ></textarea>
                      {errors.extraInfo && (
                        <p className="company-form-error">{errors.extraInfo}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="company-modal-footer">
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