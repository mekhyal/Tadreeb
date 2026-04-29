import React, { useEffect, useState } from "react";
import { FaUserCircle, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import StudentTopbar from "../../components/student/StudentTopbar";
import StudentFooter from "../../components/student/StudentFooter";
import { useAuth } from "../../context/AuthContext";
import { updateStudentProfile, getStudentProfile } from "../../api/authAPI";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIREMENTS_MESSAGE,
  isPasswordStrong,
} from "../../utils/passwordRules";

const LIMITS = {
  firstName: 40,
  lastName: 40,
  passwordMin: PASSWORD_MIN_LENGTH,
  passwordMax: PASSWORD_MAX_LENGTH,
  mobile: 20,
  university: 100,
  major: 80,
  skills: 150,
  studentId: 30,
  studentIdMin: 7,
  email: 120,
};

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

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

const formatSkills = (skills) => {
  if (Array.isArray(skills)) return skills.join(", ");
  if (typeof skills === "string") return skills;
  return "";
};

function StudentProfile() {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    password: "",
    mobile: user?.mobileNo || "",
    gender: user?.gender || "Male",
    year: user?.year || "First",
    university: user?.universityName || "",
    major: user?.major || "",
    skills: formatSkills(user?.skills),
    studentId: user?.universityID || "",
    email: user?.email || "",
  });

  const [emailDraft, setEmailDraft] = useState(user?.email || "");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      mobile: user.mobileNo || "",
      gender: user.gender || "Male",
      year: user.year || "First",
      university: user.universityName || "",
      major: user.major || "",
      skills: formatSkills(user.skills),
      studentId: user.universityID || "",
      email: user.email || "",
    }));
    setEmailDraft(user.email || "");
    setIsEditingEmail(false);
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== "student") return undefined;
    let cancelled = false;
    (async () => {
      try {
        const res = await getStudentProfile();
        const s = res.data.student;
        if (cancelled) return;
        updateUser({
          ...user,
          ...s,
          name: [s.firstName, s.lastName].filter(Boolean).join(" "),
        });
      } catch (_) {
        /* keep session snapshot if network fails */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const [errors, setErrors] = useState({});
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  const savedProfile = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    password: "",
    mobile: user?.mobileNo || "",
    gender: user?.gender || "Male",
    year: user?.year || "First",
    university: user?.universityName || "",
    major: user?.major || "",
    skills: formatSkills(user?.skills),
    studentId: user?.universityID || "",
  };

  const hasProfileChanges =
    Boolean(formData.password.trim()) ||
    formData.firstName !== savedProfile.firstName ||
    formData.lastName !== savedProfile.lastName ||
    formData.mobile !== savedProfile.mobile ||
    formData.gender !== savedProfile.gender ||
    formData.year !== savedProfile.year ||
    formData.university !== savedProfile.university ||
    formData.major !== savedProfile.major ||
    formData.skills !== savedProfile.skills ||
    formData.studentId !== savedProfile.studentId;

  const hasEmailChanges =
    emailDraft.trim().toLowerCase() !== (user?.email || "").toLowerCase();

  const displayName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ");

  const getEmailDomain = (email) => {
    return email.trim().toLowerCase().split("@")[1] || "";
  };

  const isAllowedEmailDomain = (email) => {
    return ALLOWED_EMAIL_DOMAINS.includes(getEmailDomain(email));
  };

  const checkLength = (field, label, limit, nextErrors) => {
    if (formData[field].trim().length > limit) {
      nextErrors[field] = `${label} must be ${limit} characters or less.`;
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    } else if (formData.firstName.trim().length < 2) {
      nextErrors.firstName = "First name must be at least 2 characters.";
    } else {
      checkLength("firstName", "First name", LIMITS.firstName, nextErrors);
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    } else if (formData.lastName.trim().length < 2) {
      nextErrors.lastName = "Last name must be at least 2 characters.";
    } else {
      checkLength("lastName", "Last name", LIMITS.lastName, nextErrors);
    }

    if (formData.password.trim()) {
      if (!isPasswordStrong(formData.password)) {
        nextErrors.password = PASSWORD_REQUIREMENTS_MESSAGE;
      }
    }

    if (!formData.mobile.trim()) {
      nextErrors.mobile = "Mobile number is required.";
    } else if (formData.mobile.trim().length < 7) {
      nextErrors.mobile = "Mobile number must be at least 7 characters.";
    } else {
      checkLength("mobile", "Mobile number", LIMITS.mobile, nextErrors);
    }

    if (!formData.gender) {
      nextErrors.gender = "Gender is required.";
    }

    if (!formData.year) {
      nextErrors.year = "Year is required.";
    }

    if (!formData.university.trim()) {
      nextErrors.university = "University name is required.";
    } else {
      checkLength("university", "University name", LIMITS.university, nextErrors);
    }

    if (!formData.major.trim()) {
      nextErrors.major = "Major is required.";
    } else {
      checkLength("major", "Major", LIMITS.major, nextErrors);
    }

    if (!formData.skills.trim()) {
      nextErrors.skills = "Skills are required.";
    } else {
      checkLength("skills", "Skills", LIMITS.skills, nextErrors);
    }

    if (!formData.studentId.trim()) {
      nextErrors.studentId = "Student ID is required.";
    } else if (formData.studentId.trim().length < LIMITS.studentIdMin) {
      nextErrors.studentId = "Student ID must be more than 6 characters.";
    } else {
      checkLength("studentId", "Student ID", LIMITS.studentId, nextErrors);
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

  const validateEmailDraft = () => {
    const nextErrors = {};
    const email = emailDraft.trim();

    if (!email) {
      nextErrors.email = "Email is required.";
    } else if (email.length > LIMITS.email) {
      nextErrors.email = `Email must be ${LIMITS.email} characters or less.`;
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    } else if (!isAllowedEmailDomain(email)) {
      nextErrors.email =
        "Please use a supported email provider such as Gmail, Outlook, Hotmail, Yahoo, iCloud, or Proton.";
    } else if (!hasEmailChanges) {
      nextErrors.email = "Please enter a different email address before updating.";
    }

    setErrors((prev) => ({ ...prev, email: nextErrors.email || "" }));
    return !nextErrors.email;
  };

  const handleSave = async () => {
    if (!hasProfileChanges || !validateForm() || !user) return;

    setIsSaving(true);
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      const skillsList = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        mobileNo: formData.mobile.trim(),
        gender: formData.gender,
        year: formData.year,
        universityName: formData.university.trim(),
        major: formData.major.trim(),
        skills: skillsList,
        universityID: formData.studentId.trim(),
      };
      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      const res = await updateStudentProfile(payload);
      const s = res.data.student;
      updateUser({
        ...user,
        ...s,
        name: [s.firstName, s.lastName].filter(Boolean).join(" "),
      });
      setFormData((prev) => ({ ...prev, password: "" }));
      setShowSavePopup(true);
      setTimeout(() => setShowSavePopup(false), 8000);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Could not save profile. Please try again.";

      if (/university id|student id/i.test(message)) {
        setErrors((prev) => ({
          ...prev,
          studentId: "Student ID already exists.",
        }));
        return;
      }

      setErrors((prev) => ({
        ...prev,
        general: message,
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmailDraftChange = (e) => {
    setEmailDraft(e.target.value);
    setErrors((prev) => ({ ...prev, email: "", general: "" }));
  };

  const handleEmailUpdate = async () => {
    if (!user) return;

    if (!isEditingEmail) {
      setIsEditingEmail(true);
      return;
    }

    if (!validateEmailDraft()) return;

    setIsUpdatingEmail(true);
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      const nextEmail = emailDraft.trim().toLowerCase();
      const res = await updateStudentProfile({ email: nextEmail });
      const s = res.data.student;
      updateUser({
        ...user,
        ...s,
        name: [s.firstName, s.lastName].filter(Boolean).join(" "),
      });
      setShowSavePopup(true);
      setTimeout(() => setShowSavePopup(false), 8000);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Could not update email. Please try again.";

      setErrors((prev) => ({
        ...prev,
        email: message,
      }));
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleCancelEmailEdit = () => {
    setEmailDraft(user?.email || "");
    setIsEditingEmail(false);
    setErrors((prev) => ({ ...prev, email: "" }));
  };

  return (
    <div className="student-page">
      <StudentTopbar />

      <main className="student-profile-page container">
        {showSavePopup && (
          <div className="student-save-toast">
            <div className="student-save-toast__content">
              <FaCheckCircle className="student-save-toast__icon" />
              <span>Profile changes saved successfully.</span>
            </div>
            <div className="student-save-toast__progress"></div>
          </div>
        )}

        <div className="student-profile-header">
          <div className="student-profile-user">
            <div className="student-profile-avatar">
              <FaUserCircle />
            </div>

            <div>
              <h2>{displayName || "Student Profile"}</h2>
              <p>{user?.email || ""}</p>
            </div>
          </div>

          {errors.general && (
            <p className="student-form-error" style={{ marginRight: "auto" }}>
              {errors.general}
            </p>
          )}

          <button
            type="button"
            className="student-save-btn"
            onClick={handleSave}
            disabled={isSaving || !hasProfileChanges}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="student-profile-form-grid">
          <div className="student-form-group">
            <label>First Name</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              maxLength={LIMITS.firstName}
            />
            {errors.firstName && <p className="student-form-error">{errors.firstName}</p>}
          </div>

          <div className="student-form-group">
            <label>Last Name</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              maxLength={LIMITS.lastName}
            />
            {errors.lastName && <p className="student-form-error">{errors.lastName}</p>}
          </div>

          <div className="student-form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              maxLength={LIMITS.passwordMax}
            />
            {errors.password && <p className="student-form-error">{errors.password}</p>}
          </div>

          <div className="student-form-group">
            <label>Mobile No.</label>
            <input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              maxLength={LIMITS.mobile}
            />
            {errors.mobile && <p className="student-form-error">{errors.mobile}</p>}
          </div>

          <div className="student-form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option>Male</option>
              <option>Female</option>
            </select>
            {errors.gender && <p className="student-form-error">{errors.gender}</p>}
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
            {errors.year && <p className="student-form-error">{errors.year}</p>}
          </div>

          <div className="student-form-group">
            <label>University Name</label>
            <input
              name="university"
              value={formData.university}
              onChange={handleChange}
              placeholder="Enter university name"
              maxLength={LIMITS.university}
            />
            {errors.university && <p className="student-form-error">{errors.university}</p>}
          </div>

          <div className="student-form-group">
            <label>Major</label>
            <input
              name="major"
              value={formData.major}
              onChange={handleChange}
              placeholder="Enter major"
              maxLength={LIMITS.major}
            />
            {errors.major && <p className="student-form-error">{errors.major}</p>}
          </div>

          <div className="student-form-group">
            <label>Skills</label>
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Enter your skills"
              maxLength={LIMITS.skills}
            />
            {errors.skills && <p className="student-form-error">{errors.skills}</p>}
          </div>

          <div className="student-form-group">
            <label>Student ID</label>
            <input
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Enter student ID"
              maxLength={LIMITS.studentId}
            />
            {errors.studentId && <p className="student-form-error">{errors.studentId}</p>}
          </div>
        </div>

        <div className="student-email-section">
          <h3>My Email Address</h3>

          <div className="student-email-card">
            <div className="student-email-icon">
              <FaEnvelope />
            </div>

            <div className="student-email-content">
              <h4>{user?.email || ""}</h4>
              <p>Update the email address used for login and account notices.</p>

              {isEditingEmail && (
                <div className="student-email-edit">
                  <input
                    name="email"
                    type="email"
                    value={emailDraft}
                    onChange={handleEmailDraftChange}
                    placeholder="Enter new email"
                    maxLength={LIMITS.email}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="student-form-error">{errors.email}</p>
                  )}
                </div>
              )}
            </div>

            <div className="student-email-actions">
              {isEditingEmail && (
                <button
                  type="button"
                  className="student-cancel-email-btn"
                  onClick={handleCancelEmailEdit}
                  disabled={isUpdatingEmail}
                >
                  Cancel
                </button>
              )}

              <button
                type="button"
                className="student-update-btn"
                onClick={handleEmailUpdate}
                disabled={isUpdatingEmail || (isEditingEmail && !hasEmailChanges)}
              >
                {isUpdatingEmail
                  ? "Updating..."
                  : isEditingEmail
                  ? "Update"
                  : "Change Email"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <StudentFooter />
    </div>
  );
}

export default StudentProfile;
