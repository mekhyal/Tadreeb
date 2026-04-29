import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function CompanyRequestNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  const delayedNavigate = (path) => {
    closeMobileMenu();

    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsNavigating(true);

    setTimeout(() => {
      navigate(path);
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 450);
  };

  const delayedContactNavigate = () => {
    closeMobileMenu();
    setIsNavigating(true);

    setTimeout(() => {
      navigate("/", { state: { scrollTo: "contact" } });
    }, 450);
  };

  const handleBrandClick = (e) => {
    e.preventDefault();
    delayedNavigate("/");
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
          <Link
            className="navbar-brand tadreeb-logo"
            to="/"
            onClick={handleBrandClick}
          >
            <span className="logo-dark">Tad</span>
            <span className="logo-blue">reeb</span>
          </Link>

          <button
            className="navbar-toggler custom-toggler"
            type="button"
            aria-controls="mainNavbar"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
            id="mainNavbar"
          >
            <ul className="navbar-nav navbar-center-links mb-2 mb-lg-0">
              <li className="nav-item">
                <button
                  className="nav-link nav-link-button"
                  type="button"
                  onClick={() => delayedNavigate("/")}
                >
                  Home
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link nav-link-button"
                  type="button"
                  onClick={() => delayedNavigate("/login")}
                >
                  Login
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link nav-link-button"
                  type="button"
                  onClick={delayedContactNavigate}
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default CompanyRequestNavbar;
