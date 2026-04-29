import React, { useEffect, useState } from "react";

const LIMITS = {
  title: 30,
  subtitle: 120,
  description: 500,
  rules: 300,
  qualifications: 2000,
  location: 80,
  seats: 4,
  image: 200,
};

const URL_REGEX =
  /^(https?:\/\/)?([A-Za-z0-9-]+\.)+[A-Za-z]{2,}(\/[^\s]*)?$/;

const initialErrors = {
  title: "",
  dateFrom: "",
  dateTo: "",
  registrationDeadline: "",
  subtitle: "",
  description: "",
  rules: "",
  qualifications: "",
  seats: "",
  location: "",
  image: "",
};

function CompanyProgramModal({ mode = "add", program, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    dateFrom: "",
    dateTo: "",
    registrationDeadline: "",
    subtitle: "",
    description: "",
    rules: "",
    qualifications: "",
    seats: "",
    location: "",
    image: "",
  });

  const [errors, setErrors] = useState(initialErrors);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    if (program) {
      setFormData({
        title: program.title || "",
        dateFrom: program.dateFrom || "",
        dateTo: program.dateTo || "",
        registrationDeadline: program.registrationDeadline || "",
        subtitle: program.subtitle || "",
        description: program.description || "",
        rules: program.rules || "",
        qualifications: program.qualifications || "",
        seats: program.seats || "",
        location: program.location || "",
        image: program.image || "",
      });
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [program]);

  // Helper to check length and set error if needed
  const checkLength = (field, label, limit, nextErrors) => {
  const value = formData[field];

  if (typeof value === "string" && value.trim().length > limit) {
    nextErrors[field] = `${label} must be ${limit} characters or less.`;
  }
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

  const validateForm = () => {
    const nextErrors = { ...initialErrors };

    // TITLE
    if (!formData.title.trim()) {
      nextErrors.title = "Title is required.";
    } else if (formData.title.trim().length < 6) {
      nextErrors.title = "Title must be at least 6 characters.";
    } else {
      checkLength("title", "Title", LIMITS.title, nextErrors);
    }

    // DATES
    if (!formData.dateFrom) {
      nextErrors.dateFrom = "Start date is required.";
    }

    if (!formData.dateTo) {
      nextErrors.dateTo = "End date is required.";
    }

    if (!formData.registrationDeadline) {
      nextErrors.registrationDeadline = "Registration deadline is required.";
    }

    if (formData.dateFrom && formData.dateTo) {
      if (new Date(formData.dateTo) <= new Date(formData.dateFrom)) {
        nextErrors.dateTo = "End date must be after start date.";
      }
    }

    if (formData.dateFrom && formData.registrationDeadline) {
      if (new Date(formData.registrationDeadline) >= new Date(formData.dateFrom)) {
        nextErrors.registrationDeadline =
          "Registration deadline must be before the program start date.";
      }
    }

    // SUBTITLE
    if (!formData.subtitle.trim()) {
      nextErrors.subtitle = "Subtitle is required.";
    } else if (formData.subtitle.trim().length < 8) {
      nextErrors.subtitle = "Subtitle must be at least 8 characters.";
    } else {
      checkLength("subtitle", "Subtitle", LIMITS.subtitle, nextErrors);
    }

    // DESCRIPTION
    if (!formData.description.trim()) {
      nextErrors.description = "Description is required.";
    } else if (formData.description.trim().length < 25) {
      nextErrors.description = "Description must be at least 25 characters.";
    } else {
      checkLength("description", "Description", LIMITS.description, nextErrors);
    }

    // RULES
    if (!formData.rules.trim()) {
      nextErrors.rules = "Rules are required.";
    } else if (formData.rules.trim().length < 15) {
      nextErrors.rules = "Rules must be at least 15 characters.";
    } else {
      checkLength("rules", "Rules", LIMITS.rules, nextErrors);
    }

    if (formData.qualifications.trim()) {
      checkLength("qualifications", "Qualifications", LIMITS.qualifications, nextErrors);
    }

    // SEATS
    if (!String(formData.seats).trim()) {
      nextErrors.seats = "Seats are required.";
    } else if (
      Number(formData.seats) <= 0 ||
      Number(formData.seats) > 20 ||
      Number.isNaN(Number(formData.seats))
    ) {
      nextErrors.seats = "Seats must be between 1 and 20.";
    } else {
      checkLength("seats", "Seats", LIMITS.seats, nextErrors);
    }

    // LOCATION
    if (!formData.location.trim()) {
      nextErrors.location = "Location is required.";
    } else if (formData.location.trim().length < 3) {
      nextErrors.location = "Location must be at least 3 characters.";
    } else {
      checkLength("location", "Location", LIMITS.location, nextErrors);
    }

    // IMAGE (OPTIONAL)
    if (formData.image.trim()) {
      if (!URL_REGEX.test(formData.image.trim())) {
        nextErrors.image = "Please enter a valid image URL.";
      } else {
        checkLength("image", "Image URL", LIMITS.image, nextErrors);
      }
    }

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSave({
      ...program,
      ...formData,
      seats: Number(formData.seats) || 0,
      participants: program?.participants || 0,
      status: program?.status || "Active",
    });
  };

  return (
    <div className="company-modal-overlay" onClick={onClose}>
      <div
        className="company-modal-card compact"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="company-modal-head">
          <h2>{mode === "edit" ? "Edit Program" : "Add New Program"}</h2>
          <button type="button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="company-program-modal-form" noValidate>
          <div className="company-modal-body">
            <div className="company-form company-form--compact">

              <div className="company-form-group full">
                <label>Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={LIMITS.title}
                  placeholder="Frontend Developer Internship"
                />
                {errors.title && <p className="company-form-error">{errors.title}</p>}
              </div>

              <div className="company-form-grid">
                <div className="company-form-group">
                  <label>Date From</label>
                  <input type="date" name="dateFrom" value={formData.dateFrom} onChange={handleChange} />
                  {errors.dateFrom && <p className="company-form-error">{errors.dateFrom}</p>}
                </div>

                <div className="company-form-group">
                  <label>Date To</label>
                  <input type="date" name="dateTo" value={formData.dateTo} onChange={handleChange} />
                  {errors.dateTo && <p className="company-form-error">{errors.dateTo}</p>}
                </div>
              </div>

              <div className="company-form-group full">
                <label>
                  Registration Deadline
                  <span className="company-form-optional-hint">
                    Last date students can apply or remove their application. It must
                    be before the program start date.
                  </span>
                </label>
                <input
                  type="date"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                />
                {errors.registrationDeadline && (
                  <p className="company-form-error">{errors.registrationDeadline}</p>
                )}
              </div>

              <div className="company-form-grid">
                <div className="company-form-group">
                  <label>Seats</label>
                  <select name="seats" value={formData.seats} onChange={handleChange}>
                    <option value="">Select seats</option>
                    {Array.from({ length: 20 }, (_, index) => index + 1).map(
                      (seat) => (
                        <option key={seat} value={seat}>
                          {seat}
                        </option>
                      )
                    )}
                  </select>
                  {errors.seats && <p className="company-form-error">{errors.seats}</p>}
                </div>

                <div className="company-form-group">
                  <label>Location</label>
                  <input name="location" value={formData.location} onChange={handleChange} maxLength={LIMITS.location} placeholder="Kuwait City / Remote"/>
                  {errors.location && <p className="company-form-error">{errors.location}</p>}
                </div>
              </div>

              <div className="company-form-group full">
                <label>Subtitle</label>
                <input name="subtitle" value={formData.subtitle} onChange={handleChange} maxLength={LIMITS.subtitle} placeholder="Practical training for junior frontend students"/>
                {errors.subtitle && <p className="company-form-error">{errors.subtitle}</p>}
              </div>

              <div className="company-form-group full">
                <label>Description</label>
                <textarea name="description" rows="4" value={formData.description} onChange={handleChange} maxLength={LIMITS.description} placeholder="Describe the training goals, tasks, schedule, and what the student will learn."/>
                {errors.description && <p className="company-form-error">{errors.description}</p>}
              </div>

              <div className="company-form-group full">
                <label>
                  Qualifications (optional)
                  <span className="company-form-optional-hint">
                    Describe majors, skills, or experience you prefer. Anyone can apply; you
                    accept up to your seat limit.
                  </span>
                </label>
                <textarea
                  name="qualifications"
                  rows="3"
                  value={formData.qualifications}
                  onChange={handleChange}
                  maxLength={LIMITS.qualifications}
                  placeholder="Example: Computer Science major, basic React knowledge, teamwork skills"
                />
                {errors.qualifications && (
                  <p className="company-form-error">{errors.qualifications}</p>
                )}
              </div>

              <div className="company-form-group full">
                <label>Rules</label>
                <textarea name="rules" rows="4" value={formData.rules} onChange={handleChange} maxLength={LIMITS.rules} placeholder="Example: Attend on time, submit weekly progress, follow company policies."/>
                {errors.rules && <p className="company-form-error">{errors.rules}</p>}
              </div>

              <div className="company-form-group full">
                <label>Image URL (optional)</label>
                <input name="image" value={formData.image} onChange={handleChange} maxLength={LIMITS.image} placeholder="https://example.com/program-image.jpg"/>
                {errors.image && <p className="company-form-error">{errors.image}</p>}
              </div>

            </div>
          </div>

          <div className="company-modal-footer">
            <button type="button" className="secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary">
              {mode === "edit" ? "Save Changes" : "Create Program"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompanyProgramModal;
