import React from "react";

function StatsSection() {
  const stats = [
    { number: "+100", label: "Students joined the platform" },
    { number: "20K", label: "Training opportunities explored" },
    { number: "40", label: "Companies connected with us" },
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-card">
          <div className="row text-center">
            {stats.map((item, index) => (
              <div className="col-md-4 mb-4 mb-md-0" key={index}>
                <h2 className="stats-number">{item.number}</h2>
                <p className="stats-label">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;