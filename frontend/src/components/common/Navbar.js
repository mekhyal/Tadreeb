import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGlobe } from "react-icons/fa";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const goToSection = (sectionId, tab = null) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId, activeTab: tab } });
      return;
    }

    if (tab) {
      window.dispatchEvent(
        new CustomEvent("setAudienceTab", { detail: { tab } })
      );
    }

    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const delayedNavigate = (path) => {
    if (location.pathname === path) return;

    setIsNavigating(true);

    setTimeout(() => {
      navigate(path);
    }, 450);
  };

  const handleBrandClick = (e) => {
    e.preventDefault();

    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsNavigating(true);

    setTimeout(() => {
      navigate("/");
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

      <nav className="navbar navbar-expand-lg tadreeb-navbar">
        <div className="container navbar-custom-container">
          <Link className="navbar-brand tadreeb-logo" to="/" onClick={handleBrandClick}>
            <span className="logo-dark">Tad</span>
            <span className="logo-blue">reeb</span>
          </Link>

          <button
            className="navbar-toggler custom-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav navbar-center-links mb-2 mb-lg-0">
              <li className="nav-item">
                <button
                  className="nav-link nav-link-button"
                  type="button"
                  onClick={() => goToSection("about")}
                >
                  About
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link nav-link-button"
                  type="button"
                  onClick={() => goToSection("students-companies", "students")}
                >
                  Students
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link nav-link-button"
                  type="button"
                  onClick={() => goToSection("students-companies", "companies")}
                >
                  Companies
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link nav-link-button"
                  type="button"
                  onClick={() => goToSection("contact")}
                >
                  Contact Us
                </button>
              </li>
            </ul>

            <div className="navbar-actions d-flex align-items-center gap-3">
              <button className="language-btn" type="button">
                <FaGlobe />
                <span>English</span>
              </button>

              <button
                type="button"
                className="login-link login-link-button"
                onClick={() => delayedNavigate("/login")}
              >
                Login / Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;