import React, { useState } from "react";

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const initialForm = { name: "", email: "", message: "" };
const initialErrors = { name: "", email: "", message: "" };

function ContactSection() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [submitted, setSubmitted] = useState(false);

  const validate = (values) => {
    const next = { ...initialErrors };

    if (!values.name.trim()) {
      next.name = "Name is required";
    } else if (values.name.trim().length < 2) {
      next.name = "Name must be at least 2 characters";
    } else if (values.name.trim().length > 100) {
      next.name = "Name must be 100 characters or fewer";
    }

    if (!values.email.trim()) {
      next.email = "Email is required";
    } else if (!EMAIL_REGEX.test(values.email.trim())) {
      next.email = "Please enter a valid email address";
    }

    if (!values.message.trim()) {
      next.message = "Message is required";
    } else if (values.message.trim().length < 10) {
      next.message = "Message must be at least 10 characters";
    } else if (values.message.trim().length > 2000) {
      next.message = "Message must be 2000 characters or fewer";
    }

    return next;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (submitted) setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some(Boolean);
    if (hasErrors) {
      setSubmitted(false);
      return;
    }

    setSubmitted(true);
    setForm(initialForm);
  };

  return (
    <section className="contact-section">
      <div className="container">
        <div className="contact-box">
          <div className="row g-4 align-items-start">
            <div className="col-lg-5">
              <h2 className="contact-title">Contact Us</h2>

              <p className="contact-text">
                Reach out to us for support, questions, or collaboration. We are
                here to help students and companies connect in the best way.
              </p>

              <div className="contact-details">
                <p>+965 5555 4444</p>
                <p>+965 5555 5555</p>
                <p>contact@tadreeb.com</p>
              </div>
            </div>

            <div className="col-lg-7">
              <form
                className="contact-form"
                onSubmit={handleSubmit}
                noValidate
              >
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby="contact-name-error"
                    maxLength={100}
                  />
                  {errors.name && (
                    <p
                      id="contact-name-error"
                      className="contact-error"
                      role="alert"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby="contact-email-error"
                    maxLength={100}
                  />
                  {errors.email && (
                    <p
                      id="contact-email-error"
                      className="contact-error"
                      role="alert"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Message..."
                    value={form.message}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby="contact-message-error"
                    maxLength={2000}
                  />
                  {errors.message && (
                    <p
                      id="contact-message-error"
                      className="contact-error"
                      role="alert"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                <button type="submit" className="submit-btn">
                  Submit
                </button>

                {submitted && (
                  <p className="contact-success" role="status">
                    Thanks! Your message has been received.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
