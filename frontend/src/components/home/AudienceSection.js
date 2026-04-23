import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import studentsImage from "../../assets/group-of-students-3.jpg";
import companyImage from "../../assets/company-image.jpeg";

function AudienceSection() {
  const [activeTab, setActiveTab] = useState("students");
  const [isNavigating, setIsNavigating] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSetAudienceTab = (event) => {
      if (event.detail?.tab) {
        setActiveTab(event.detail.tab);
      }
    };

    window.addEventListener("setAudienceTab", handleSetAudienceTab);

    return () => {
      window.removeEventListener("setAudienceTab", handleSetAudienceTab);
    };
  }, []);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const delayedNavigate = (path) => {
    if (location.pathname === path) return;

    setIsNavigating(true);

    setTimeout(() => {
      navigate(path);
    }, 450);
  };

  const content = {
    students: {
      image: studentsImage,
      imageAlt: "Group of students",
      title: "Training opportunities for students",
      text: "Students can explore available opportunities, connect with trusted companies, and build practical experience that supports their academic and professional journey.",
      features: [
        "Discover organized internship and training opportunities",
        "Build practical experience before graduation",
        "Connect with trusted companies through one platform",
      ],
      buttonText: "Join as Student",
    },
    companies: {
      image: companyImage,
      imageAlt: "Company team working together",
      title: "Smart access to motivated student talent",
      text: "Companies can publish opportunities, attract qualified students, and manage their internship and training pipeline in a more professional and structured way.",
      features: [
        "Reach qualified and motivated students",
        "Publish opportunities in a clear and organized format",
        "Strengthen company presence among future talent",
      ],
      buttonText: "Join as Company",
    },
  };

  const current = content[activeTab];

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

      <section className="audience-section">
        <div className="container">
          <div className="audience-tabs audience-tabs-wire">
            <button
              className={`tab-btn wire-tab ${activeTab === "students" ? "active" : ""}`}
              onClick={() => setActiveTab("students")}
              type="button"
            >
              Students
            </button>

            <button
              className={`tab-btn wire-tab ${activeTab === "companies" ? "active" : ""}`}
              onClick={() => setActiveTab("companies")}
              type="button"
            >
              Companies
            </button>
          </div>

          <div className="audience-wireframe-card professional-audience-card">
            <div className="audience-wire-image">
              <img
                src={current.image}
                alt={current.imageAlt}
                className="audience-real-image"
              />
            </div>

            <div className="audience-wire-content professional-audience-content">
              <h3 className="audience-wire-title">{current.title}</h3>

              <p className="audience-main-text">{current.text}</p>

              <ul className="audience-feature-list">
                {current.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>

              <div className="audience-wire-action">
                <button
                  type="button"
                  className="primary-btn primary-btn-link small-btn"
                  onClick={() => delayedNavigate("/login")}
                >
                  {current.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AudienceSection;