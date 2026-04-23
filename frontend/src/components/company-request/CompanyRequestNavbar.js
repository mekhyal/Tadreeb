import React, { useState } from "react";
import { FaGlobe } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

function CompanyRequestNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  const delayedNavigate = (path) => {
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
    setIsNavigating(true);

    setTimeout(() => {
      window.location.href = "/#contact";
    }, 450);
  };

  const handleBrandClick = () => {
    setIsNavigating(true);

    setTimeout(() => {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 450);
  };

  return (
    <>
      {isNavigating && (
        <div className="company-request-loader">
          <div className="company-request-loader-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Loading page...</p>
        </div>
      )}

      <header className="company-request-navbar">
        <div className="company-request-navbar__inner">
          <button
            type="button"
            className="company-request-brand"
            onClick={handleBrandClick}
          >
            <span className="logo-dark">Tad</span>
            <span className="logo-blue">reeb</span>
          </button>

          <nav className="company-request-navbar__links">
            <button type="button" onClick={() => delayedNavigate("/")}>
              Home
            </button>

            <button type="button" onClick={() => delayedNavigate("/login")}>
              login
            </button>

            <button
              type="button"
              onClick={delayedContactNavigate}
            >
              Contact us
            </button>
          </nav>

          <button type="button" className="company-request-lang-btn">
            <FaGlobe />
          </button>
        </div>
      </header>
    </>
  );
}

export default CompanyRequestNavbar;