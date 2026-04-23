import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import heroImage from "../../assets/hero-image-2.jpg";

function HeroSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  const delayedNavigate = (path) => {
    if (location.pathname === path) return;

    setIsNavigating(true);

    setTimeout(() => {
      navigate(path);
    }, 450);
  };

  return (
    <>
      {isNavigating && (
        <div className="app-global-loader">
          <div className="app-loader-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Loading page...</p>
        </div>
      )}

      <section className="hero-section">
        <div className="container">
          <div className="hero-wrapper">
            <div className="row align-items-center g-4">
              <div className="col-lg-6">
                <div className="hero-content">
                  <p className="hero-top-text">
                    Build better connections between students and companies
                  </p>

                  <h1 className="hero-title">
                    Start your training journey with a trusted modern platform
                  </h1>

                  <p className="hero-description">
                    Tadreeb helps students discover valuable opportunities and
                    allows companies to connect with motivated talent in a clean,
                    clear, and professional environment.
                  </p>

                  <button
                    type="button"
                    className="primary-btn primary-btn-link"
                    onClick={() => delayedNavigate("/login")}
                  >
                    Get Started
                  </button>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="hero-visual">
                  <div className="hero-image-box">
                    <img
                      src={heroImage}
                      alt="Training and education opportunities"
                      className="hero-real-image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;