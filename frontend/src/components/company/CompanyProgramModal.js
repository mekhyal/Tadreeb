import React, { useEffect, useState } from "react";

const initialErrors = {
  title: "",
  dateFrom: "",
  dateTo: "",
  subtitle: "",
  description: "",
  rules: "",
  seats: "",
  location: "",
};

function CompanyProgramModal({ mode = "add", program, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    dateFrom: "",
    dateTo: "",
    subtitle: "",
    description: "",
    rules: "",
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
        subtitle: program.subtitle || "",
        description: program.description || "",
        rules: program.rules || "",
        seats: program.seats || "",
        location: program.location || "",
        image: program.image || "",
      });
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [program]);

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

    if (!formData.title.trim()) {
      nextErrors.title = "Title is required.";
    } else if (formData.title.trim().length < 4) {
      nextErrors.title = "Title must be at least 4 characters.";
    }

    if (!formData.dateFrom) {
      nextErrors.dateFrom = "Start date is required.";
    }

    if (!formData.dateTo) {
      nextErrors.dateTo = "End date is required.";
    }

    if (formData.dateFrom && formData.dateTo) {
      if (new Date(formData.dateTo) < new Date(formData.dateFrom)) {
        nextErrors.dateTo = "End date must be after start date.";
      }
    }

    if (!formData.subtitle.trim()) {
      nextErrors.subtitle = "Subtitle is required.";
    } else if (formData.subtitle.trim().length < 8) {
      nextErrors.subtitle = "Subtitle must be at least 8 characters.";
    }

    if (!formData.description.trim()) {
      nextErrors.description = "Description is required.";
    } else if (formData.description.trim().length < 25) {
      nextErrors.description = "Description must be at least 25 characters.";
    }

    if (!formData.rules.trim()) {
      nextErrors.rules = "Rules are required.";
    } else if (formData.rules.trim().length < 15) {
      nextErrors.rules = "Rules must be at least 15 characters.";
    }

    if (!String(formData.seats).trim()) {
      nextErrors.seats = "Seats are required.";
    } else if (
      Number(formData.seats) <= 0 ||
      Number.isNaN(Number(formData.seats))
    ) {
      nextErrors.seats = "Seats must be a number greater than 0.";
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
          <button type="button" onClick={onClose}>
            ×
          </button>
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
                  placeholder="Example: Frontend Bootcamp"
                />
                {errors.title && (
                  <p className="company-form-error">{errors.title}</p>
                )}
              </div>

              <div className="company-form-grid">
                <div className="company-form-group">
                  <label>Date From</label>
                  <input
                    type="date"
                    name="dateFrom"
                    value={formData.dateFrom}
                    onChange={handleChange}
                  />
                  {errors.dateFrom && (
                    <p className="company-form-error">{errors.dateFrom}</p>
                  )}
                </div>

                <div className="company-form-group">
                  <label>Date To</label>
                  <input
                    type="date"
                    name="dateTo"
                    value={formData.dateTo}
                    onChange={handleChange}
                  />
                  {errors.dateTo && (
                    <p className="company-form-error">{errors.dateTo}</p>
                  )}
                </div>
              </div>

              <div className="company-form-grid">
                <div className="company-form-group">
                  <label>Seats</label>
                  <input
                    name="seats"
                    value={formData.seats}
                    onChange={handleChange}
                    placeholder="Example: 20"
                  />
                  {errors.seats && (
                    <p className="company-form-error">{errors.seats}</p>
                  )}
                </div>

                <div className="company-form-group">
                  <label>Location</label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Example: Kuwait City or Remote"
                  />
                  {errors.location && (
                    <p className="company-form-error">{errors.location}</p>
                  )}
                </div>
              </div>

              <div className="company-form-group full">
                <label>Subtitle</label>
                <input
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="Example: React and UI Development Program"
                />
                {errors.subtitle && (
                  <p className="company-form-error">{errors.subtitle}</p>
                )}
              </div>

              <div className="company-form-group full">
                <label>Description</label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Example: A practical training program focused on React, reusable components, and responsive UI."
                ></textarea>
                {errors.description && (
                  <p className="company-form-error">{errors.description}</p>
                )}
              </div>

              <div className="company-form-group full">
                <label>Rules</label>
                <textarea
                  name="rules"
                  rows="4"
                  value={formData.rules}
                  onChange={handleChange}
                  placeholder="Example: Attend all sessions, submit weekly tasks, and complete the final project."
                ></textarea>
                {errors.rules && (
                  <p className="company-form-error">{errors.rules}</p>
                )}
              </div>

              <div className="company-form-group full">
                <label>
                  Image URL <span className="optional-text">(optional)</span>
                </label>
                <input
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Example: https://example.com/program-image.jpg"
                />
              </div>
            </div>
          </div>

          <div className="company-modal-footer">
            <button type="button" className="secondary" onClick={onClose}>
              Cancel
            </button>

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