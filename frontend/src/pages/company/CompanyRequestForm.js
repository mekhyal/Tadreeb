import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyRequestNavbar from "../../components/company-request/CompanyRequestNavbar";
import CompanyRequestFooter from "../../components/company-request/CompanyRequestFooter";
import { submitCompanyRequest } from "../../api/companyRequestAPI";

const initialFormData = {
  companyName: "",
  industry: "",
  officialEmail: "",
  phoneNumber: "",
  website: "",
  companySize: "",
  location: "",
  foundedYear: "",
  contactPerson: "",
  companyDescription: "",
  joinReason: "",
  confirmInfo: false,
};

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PHONE_REGEX = /^[+0-9\s\-()]{7,20}$/;
const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;
const YEAR_REGEX = /^(19|20)\d{2}$/;
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

function CompanyRequestForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({ general: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showRedirectLoader, setShowRedirectLoader] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required.";
    } else if (formData.companyName.trim().length < 3) {
      newErrors.companyName = "Company name must be at least 3 characters.";
    }

    if (!formData.industry.trim()) {
      newErrors.industry = "Industry is required.";
    }

    if (!formData.officialEmail.trim()) {
      newErrors.officialEmail = "Official email is required.";
    } else if (!EMAIL_REGEX.test(formData.officialEmail)) {
      newErrors.officialEmail = "Please enter a valid company email.";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!PHONE_REGEX.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number.";
    }

    if (formData.website.trim() && !URL_REGEX.test(formData.website)) {
      newErrors.website = "Please enter a valid website URL.";
    }

    if (!formData.companySize.trim()) {
      newErrors.companySize = "Company size is required.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    } else if (formData.location.trim().length < 3) {
      newErrors.location = "Location must be at least 3 characters.";
    }

    if (formData.foundedYear.trim()) {
      if (!YEAR_REGEX.test(formData.foundedYear)) {
        newErrors.foundedYear = "Please enter a valid 4-digit year.";
      } else {
        const y = Number(formData.foundedYear);
        const currentYear = new Date().getFullYear();
        if (y < 1800 || y > currentYear) {
          newErrors.foundedYear = `Year must be between 1800 and ${currentYear}.`;
        }
      }
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = "Contact person name is required.";
    } else if (formData.contactPerson.trim().length < 3) {
      newErrors.contactPerson = "Contact person name must be at least 3 characters.";
    }

    if (!formData.companyDescription.trim()) {
      newErrors.companyDescription = "Company description is required.";
    } else if (formData.companyDescription.trim().length < 25) {
      newErrors.companyDescription =
        "Company description must be at least 25 characters.";
    }

    if (!formData.joinReason.trim()) {
      newErrors.joinReason = "Please explain why you want to join.";
    } else if (formData.joinReason.trim().length < 25) {
      newErrors.joinReason = "This field must be at least 25 characters.";
    }

    if (!formData.confirmInfo) {
      newErrors.confirmInfo = "You must confirm the information.";
    }

    return newErrors;
  };

  const buildPayload = () => ({
    companyName: formData.companyName.trim(),
    industry: formData.industry.trim(),
    officialEmail: formData.officialEmail.trim(),
    phoneNumber: formData.phoneNumber.trim(),
    website: formData.website.trim(),
    companySize: formData.companySize.trim(),
    location: formData.location.trim(),
    foundedYear: formData.foundedYear.trim(),
    contactPerson: formData.contactPerson.trim(),
    companyDescription: formData.companyDescription.trim(),
    joinReason: formData.joinReason.trim(),
    confirmInfo: formData.confirmInfo,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);

    const payload = buildPayload();

    try {
      await submitCompanyRequest(payload);
      setIsSubmitting(false);
      setShowSuccessToast(true);
      setFormData(initialFormData);
      setErrors({ general: "" });

      setTimeout(() => {
        setShowSuccessToast(false);
        setShowRedirectLoader(true);

        setTimeout(() => {
          navigate("/");
          window.scrollTo({ top: 0, behavior: "auto" });
        }, 1200);
      }, 700);
    } catch (error) {
      setIsSubmitting(false);
      setErrors((prev) => ({
        ...prev,
        general:
          error.response?.data?.message ||
          "Could not submit your request. Please try again.",
      }));
    }
  };

  return (
    <div className="company-request-page">
      <CompanyRequestNavbar />

      {showSuccessToast && (
        <div className="company-request-toast">
          <div className="company-request-toast__content">
            Request submitted successfully.
          </div>
          <div className="company-request-toast__progress"></div>
        </div>
      )}

      {showRedirectLoader && (
        <div className="company-request-submit-loader">
          <div className="company-request-submit-loader__dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Redirecting to home page...</p>
        </div>
      )}

      {showConfirm && (
        <div className="company-request-confirm-overlay" role="presentation">
          <div
            className="company-request-confirm-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="company-request-confirm-title"
          >
            <h3 id="company-request-confirm-title">Confirm your company request</h3>
            <p>
              Please review your company details before submitting your request
              to Tadreeb.
            </p>
            <div className="company-request-confirm-actions">
              <button
                type="button"
                className="company-request-confirm-secondary"
                onClick={() => setShowConfirm(false)}
              >
                Review again
              </button>
              <button
                type="button"
                className="company-request-confirm-primary"
                onClick={handleConfirmSubmit}
              >
                Yes, submit request
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="company-request-main">
        <div className="container">
          <div className="company-request-hero">
            <h1>Request to Join as a Company</h1>
            <p>
              Fill out this form if your company wants to join our platform and
              post training, internship, or job opportunities for students.
            </p>
          </div>

          <div className="company-request-card">
            <form className="company-request-form" onSubmit={handleSubmit} noValidate>
              <h3>Company Information</h3>
              {errors.general && (
                <p className="company-request-error">{errors.general}</p>
              )}

              <div className="company-request-grid">
                <div className="company-request-group">
                  <label htmlFor="companyName">Company Name</label>
                  <input
                    id="companyName"
                    type="text"
                    name="companyName"
                    placeholder="Enter company name"
                    maxLength={200}
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                  {errors.companyName && <p className="company-request-error">{errors.companyName}</p>}
                </div>

                <div className="company-request-group">
                  <label htmlFor="industry">Industry</label>
                  <select
                    id="industry"
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
                  {errors.industry && <p className="company-request-error">{errors.industry}</p>}
                </div>

                <div className="company-request-group">
                  <label htmlFor="officialEmail">Official Email</label>
                  <input
                    id="officialEmail"
                    type="email"
                    name="officialEmail"
                    placeholder="company@email.com"
                    maxLength={100}
                    value={formData.officialEmail}
                    onChange={handleChange}
                  />
                  {errors.officialEmail && <p className="company-request-error">{errors.officialEmail}</p>}
                </div>

                <div className="company-request-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    id="phoneNumber"
                    type="text"
                    name="phoneNumber"
                    placeholder="+965 XX XXX XXXX"
                    maxLength={20}
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                  {errors.phoneNumber && <p className="company-request-error">{errors.phoneNumber}</p>}
                </div>

                <div className="company-request-group">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    type="text"
                    name="website"
                    placeholder="https://example.com"
                    maxLength={200}
                    value={formData.website}
                    onChange={handleChange}
                  />
                  {errors.website && <p className="company-request-error">{errors.website}</p>}
                </div>

                <div className="company-request-group">
                  <label htmlFor="companySize">Company Size</label>
                  <select
                    id="companySize"
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
                  {errors.companySize && <p className="company-request-error">{errors.companySize}</p>}
                </div>

                <div className="company-request-group">
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    type="text"
                    name="location"
                    placeholder="City, Country"
                    maxLength={100}
                    value={formData.location}
                    onChange={handleChange}
                  />
                  {errors.location && <p className="company-request-error">{errors.location}</p>}
                </div>

                <div className="company-request-group">
                  <label htmlFor="foundedYear">Founded Year</label>
                  <select
                    id="foundedYear"
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
                  {errors.foundedYear && <p className="company-request-error">{errors.foundedYear}</p>}
                </div>
              </div>

              <div className="company-request-group company-request-group-full">
                <label htmlFor="contactPerson">HR / Contact Person Name</label>
                <input
                  id="contactPerson"
                  type="text"
                  name="contactPerson"
                  placeholder="Enter contact person name"
                  maxLength={100}
                  value={formData.contactPerson}
                  onChange={handleChange}
                />
                {errors.contactPerson && <p className="company-request-error">{errors.contactPerson}</p>}
              </div>

              <div className="company-request-group company-request-group-full">
                <label htmlFor="companyDescription">Company Description</label>
                <textarea
                  id="companyDescription"
                  name="companyDescription"
                  rows="5"
                  maxLength={2000}
                  placeholder="Tell us about your company, services, and what your company does."
                  value={formData.companyDescription}
                  onChange={handleChange}
                ></textarea>
                {errors.companyDescription && (
                  <p className="company-request-error">{errors.companyDescription}</p>
                )}
              </div>

              <div className="company-request-group company-request-group-full">
                <label htmlFor="joinReason">Why do you want to join our platform?</label>
                <textarea
                  id="joinReason"
                  name="joinReason"
                  rows="5"
                  maxLength={2000}
                  placeholder="Explain why your company wants to join and what type of opportunities you want to provide."
                  value={formData.joinReason}
                  onChange={handleChange}
                ></textarea>
                {errors.joinReason && <p className="company-request-error">{errors.joinReason}</p>}
              </div>

              <div className="company-request-check">
                <label htmlFor="confirmInfo">
                  <input
                    id="confirmInfo"
                    type="checkbox"
                    name="confirmInfo"
                    checked={formData.confirmInfo}
                    onChange={handleChange}
                  />
                  <span>
                    I confirm that the information provided is correct and that I
                    represent this company.
                  </span>
                </label>
                {errors.confirmInfo && <p className="company-request-error">{errors.confirmInfo}</p>}
              </div>

              <div className="company-request-actions">
                <button
                  type="submit"
                  className="company-request-submit"
                  disabled={isSubmitting || showRedirectLoader}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <CompanyRequestFooter />
    </div>
  );
}

export default CompanyRequestForm;
