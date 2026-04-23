import React, { useState } from "react";
import {
  FaYoutube,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

function CompanyRequestFooter() {
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

      <footer className="company-request-footer">
        <div className="container">
          <div className="company-request-footer__top">
            <button
              type="button"
              className="company-request-footer__brand"
              onClick={handleBrandClick}
            >
              <span className="logo-dark">Tad</span>
              <span className="logo-blue">reeb</span>
            </button>

            <div className="company-request-footer__links">
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
            </div>
          </div>

          <hr />

          <div className="company-request-footer__bottom">
            <p>CompanyName @ 202X. All rights reserved.</p>

            <div className="company-request-footer__socials">
              <span><FaYoutube /></span>
              <span><FaFacebookF /></span>
              <span><FaTwitter /></span>
              <span><FaInstagram /></span>
              <span><FaLinkedinIn /></span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default CompanyRequestFooter;