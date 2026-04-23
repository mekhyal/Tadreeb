import React from "react";

function ContactSection() {
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
              <form className="contact-form">
                <input type="text" placeholder="Your Name" />
                <input type="email" placeholder="Your Email" />
                <textarea rows="5" placeholder="Message..." />
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;