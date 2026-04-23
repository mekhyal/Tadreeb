import React from "react";
import { FaBullseye, FaRegHandshake, FaRegCalendarAlt } from "react-icons/fa";

function AboutSection() {
  const items = [
    {
      icon: <FaBullseye />,
      title: "Our Mission",
      text: "We make training opportunities clearer, easier to access, and more organized for students and companies.",
    },
    {
      icon: <FaRegHandshake />,
      title: "Strong Connections",
      text: "We help reduce the gap between academic study and real professional environments through better communication.",
    },
    {
      icon: <FaRegCalendarAlt />,
      title: "Better Experience",
      text: "Our platform is built to offer a practical, smooth, and trustworthy user experience for everyone.",
    },
  ];

  return (
    <section className="about-section">
      <div className="container">
        <div className="section-heading text-center">
          <p className="section-subtitle">ABOUT US</p>
          <h2 className="section-title">
            A simple platform built with clarity, trust, and purpose
          </h2>
        </div>

        <div className="row mt-5">
          {items.map((item, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="about-card">
                <div className="about-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutSection;