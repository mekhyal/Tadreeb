import React, { useEffect, useMemo, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIREMENTS_MESSAGE,
  isPasswordStrong,
} from "../../utils/passwordRules";

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PHONE_REGEX = /^[+0-9\s\-()]{7,20}$/;
const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;
const ALLOWED_EMAIL_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "yahoo.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "tadreeb.com",
];

const LIMITS = {
  name: 80,
  email: 120,
  passwordMin: PASSWORD_MIN_LENGTH,
  passwordMax: PASSWORD_MAX_LENGTH,
  phone: 20,
  location: 80,
  studentId: 30,
  studentIdMin: 7,
  universityName: 100,
  major: 80,
  country: 80,
  skills: 150,
  industry: 100,
  website: 200,
  companySize: 50,
  foundedYear: 4,
  contactPerson: 100,
  jobTitle: 100,
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
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    status: "Active",
    phone: "",
    location: "",

    universityName: "",
    major: "",
    year: "",
    gender: "",
    studentId: "",
    skills: "",

    industry: "",
    website: "",
    companySize: "",
    foundedYear: "",
    contactPerson: "",
    language: "",
    jobTitle: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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
        next.status = "Active";
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

    if (formData.role === "Company") {
      if (!formData.name.trim()) {
        nextErrors.name = "Company name is required.";
      } else if (formData.name.trim().length < 3) {
        nextErrors.name = "Company name must be at least 3 characters.";
      } else {
        checkMax("name", "Company name", LIMITS.name, nextErrors);
      }
    } else {
      if (!formData.firstName.trim()) {
        nextErrors.firstName = "First name is required.";
      } else if (formData.firstName.trim().length < 2) {
        nextErrors.firstName = "First name must be at least 2 characters.";
      } else {
        checkMax("firstName", "First name", LIMITS.name, nextErrors);
      }

      if (!formData.lastName.trim()) {
        nextErrors.lastName = "Last name is required.";
      } else if (formData.lastName.trim().length < 2) {
        nextErrors.lastName = "Last name must be at least 2 characters.";
      } else {
        checkMax("lastName", "Last name", LIMITS.name, nextErrors);
      }
    }

    const emailDomain = formData.email.trim().toLowerCase().split("@")[1] || "";
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      nextErrors.email = "Please enter a valid email.";
    } else if (!ALLOWED_EMAIL_DOMAINS.includes(emailDomain)) {
      nextErrors.email =
        "Please use a supported email provider such as Gmail, Outlook, Hotmail, Yahoo, iCloud, or Proton.";
    } else {
      checkMax("email", "Email", LIMITS.email, nextErrors);
    }

    if (!formData.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (!isPasswordStrong(formData.password)) {
      nextErrors.password = PASSWORD_REQUIREMENTS_MESSAGE;
    }

    if (formData.role !== "Admin" && !formData.status.trim()) {
      nextErrors.status = "Status is required.";
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = "Phone is required.";
    } else if (!PHONE_REGEX.test(formData.phone.trim())) {
      nextErrors.phone = "Please enter a valid phone number.";
    } else {
      checkMax("phone", "Phone", LIMITS.phone, nextErrors);
    }

    if (formData.role === "Company") {
      if (!formData.location.trim()) {
        nextErrors.location = "Location is required.";
      } else if (formData.location.trim().length < 3) {
        nextErrors.location = "Location must be at least 3 characters.";
      } else {
        checkMax("location", "Location", LIMITS.location, nextErrors);
      }
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

    if (!formData.studentId.trim()) {
      nextErrors.studentId = "Student ID is required.";
    } else if (formData.studentId.trim().length < LIMITS.studentIdMin) {
      nextErrors.studentId = "Student ID must be more than 6 characters.";
    } else {
      checkMax("studentId", "Student ID", LIMITS.studentId, nextErrors);
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

    if (formData.website.trim() && !URL_REGEX.test(formData.website.trim())) {
      nextErrors.website = "Please enter a valid website URL.";
    } else {
      checkMax("website", "Website", LIMITS.website, nextErrors);
    }

    if (!formData.companySize.trim()) {
      nextErrors.companySize = "Company size is required.";
    }

    if (formData.foundedYear && (
      Number.isNaN(Number(formData.foundedYear)) ||
      Number(formData.foundedYear) < 1800 ||
      Number(formData.foundedYear) > new Date().getFullYear()
    )) {
      nextErrors.foundedYear = "Year must be between 1800 and the current year.";
    }

    if (!formData.contactPerson.trim()) {
      nextErrors.contactPerson = "Contact person is required.";
    } else {
      checkMax("contactPerson", "Contact person", LIMITS.contactPerson, nextErrors);
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
      name:
        formData.role === "Company"
          ? formData.name.trim()
          : `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: formData.role,
      status: formData.role === "Admin" ? "Active" : formData.status,
      phone: formData.phone.trim(),
      location: formData.role === "Company" ? formData.location.trim() : "",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    let roleFields = {};

    if (formData.role === "Student") {
      roleFields = {
        studentId: formData.studentId.trim(),
        universityName: formData.universityName.trim(),
        major: formData.major.trim(),
        year: formData.year,
        gender: formData.gender,
        skills: formData.skills.trim(),
        status: formData.status,
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
      };
    }

    if (formData.role === "Admin") {
      roleFields = {
        adminId: generateRoleId("ADM"),
        jobTitle: formData.jobTitle.trim(),
        language: formData.language,
        gender: formData.gender,
        country: formData.country.trim(),
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

                {formData.role === "Company" ? (
                  <div className="company-form-grid">
                    <div className="company-form-group">
                      <label>Company Name</label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Example: Tadreeb Company"
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
                ) : (
                  <div className="company-form-grid">
                    <div className="company-form-group">
                      <label>First Name</label>
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter first name"
                        maxLength={LIMITS.name}
                      />
                      {errors.firstName && (
                        <p className="company-form-error">{errors.firstName}</p>
                      )}
                    </div>

                    <div className="company-form-group">
                      <label>Last Name</label>
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter last name"
                        maxLength={LIMITS.name}
                      />
                      {errors.lastName && (
                        <p className="company-form-error">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                )}

                {formData.role !== "Company" && (
                  <div className="company-form-grid">
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
                )}

                <div className="company-form-grid">
                  <div className="company-form-group">
                    <label>Password</label>
                    <div className="admin-password-wrap">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="8-24 characters"
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

                  <div className="company-form-group">
                    <label>Status</label>
                    {formData.role === "Admin" ? (
                      <span className="admin-user-fixed-status active">Active</span>
                    ) : (
                      <select name="status" value={formData.status} onChange={handleChange}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    )}
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

                  {formData.role === "Company" && (
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
                  )}
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
                        <label>Student ID</label>
                        <input
                          name="studentId"
                          value={formData.studentId}
                          onChange={handleChange}
                          placeholder="Enter student ID"
                          maxLength={LIMITS.studentId}
                        />
                        {errors.studentId && (
                          <p className="company-form-error">{errors.studentId}</p>
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
                        <select
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                        >
                          <option value="">Select industry</option>
                          <option value="Technology">Technology</option>
                          <option value="Finance">Finance</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Education">Education</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Other">Other</option>
                        </select>
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
                        <select
                          name="foundedYear"
                          value={formData.foundedYear}
                          onChange={handleChange}
                        >
                          <option value="">Select founded year</option>
                          {Array.from(
                            { length: new Date().getFullYear() - 1799 },
                            (_, index) => String(new Date().getFullYear() - index)
                          ).map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
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
