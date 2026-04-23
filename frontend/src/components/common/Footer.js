import React from "react";
import {
  FaYoutube,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="tadreeb-footer">
      <div className="container">
        <div className="footer-top">
          <h5 className="footer-logo">
            <span className="logo-dark">Tad</span>
            <span className="logo-blue">reeb</span>
          </h5>
           <a href="#top" className="go-top-link">Go Top ↑</a>
        </div>

        <hr />

        <div className="footer-bottom">
          <p>Tadreeb © 2026. All rights reserved.</p>

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
  );
}

export default Footer;