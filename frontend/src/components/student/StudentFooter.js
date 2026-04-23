import React, { useState } from "react";
import {
  FaYoutube,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

function StudentFooter() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const isHome = location.pathname === "/student";
  const isProfile = location.pathname === "/student/profile";
  const isApplications = location.pathname === "/student/applications";

  const delayedNavigate = (path) => {
    if (location.pathname === path) return;

    setIsNavigating(true);

    setTimeout(() => {
      navigate(path);
    }, 450);
  };

  const delayedContactNavigate = () => {
    setIsNavigating(true);

    setTimeout(() => {
      window.location.href = "/#contact";
    }, 450);
  };

  return (
    <>
      {isNavigating && (
        <div className="student-global-loader">
          <div className="student-loader-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Loading page...</p>
        </div>
      )}

      <footer className="student-footer">
        <div className="container">
          <div className="student-footer-top">
            <Link to="/" className="student-footer-brand">
              <span className="logo-dark">Tad</span>
              <span className="logo-blue">reeb</span>
            </Link>

            <div className="student-footer-links">
              {!isHome && (
                <button type="button" onClick={() => delayedNavigate("/student")}>
                  Home
                </button>
              )}

              {!isProfile && (
                <button
                  type="button"
                  onClick={() => delayedNavigate("/student/profile")}
                >
                  Profile
                </button>
              )}

              {!isApplications && (
                <button
                  type="button"
                  onClick={() => delayedNavigate("/student/applications")}
                >
                  Applications
                </button>
              )}

              <button type="button" onClick={delayedContactNavigate}>
                Contact us
              </button>
            </div>
          </div>

          <hr />

          <div className="student-footer-bottom">
            <p>Tadreeb @ 202X. All rights reserved.</p>

            <div className="footer-socials" aria-label="Social media icons">
              <span className="social-icon"><FaYoutube /></span>
              <span className="social-icon"><FaFacebookF /></span>
              <span className="social-icon"><FaTwitter /></span>
              <span className="social-icon"><FaInstagram /></span>
              <span className="social-icon"><FaLinkedinIn /></span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default StudentFooter;