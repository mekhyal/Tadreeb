import React from "react";

function StudentCard({ program, onOpen }) {
  return (
    <div className="student-program-card">
      <div className="student-program-card__image">
        <img src={program.image} alt={program.title} />
      </div>

      <div className="student-program-card__content">
        <span
          className={`student-program-badge ${
            program.status === "Complete" ? "complete" : "register"
          }`}
        >
          {program.status}
        </span>

        <h3>{program.title}</h3>

        <p>{program.shortDescription}</p>

        <div className="student-program-meta">
          <span>
            Date: {program.startDate} To {program.endDate}
          </span>
          <span>Open to: {program.openTo}</span>
          <span>
            Openings: up to {program.seats} — {program.availableSeats} still available
            (filled after the company accepts you)
          </span>
          <span>by {program.company}</span>
        </div>

        <button
          type="button"
          className="student-learn-more-btn"
          onClick={() => onOpen(program)}
        >
          Learn more
        </button>
      </div>
    </div>
  );
}

export default StudentCard;