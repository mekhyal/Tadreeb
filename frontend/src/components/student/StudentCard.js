import React from "react";
import { programStatusClass } from "../../utils/programStatus";

function StudentCard({ program, onOpen }) {
  const isRegistering = program.status === "Register Now";

  return (
    <div className="student-program-card">
      <div className="student-program-card__image">
        <img src={program.image} alt={program.title} />
      </div>

      <div className="student-program-card__content">
        <span
          className={`student-program-badge ${programStatusClass(program.status)}`}
        >
          {program.status}
        </span>

        <h3>{program.title}</h3>

        <p>{program.shortDescription}</p>

        <div className="student-program-meta">
          <span>
            Date: {program.startDate} To {program.endDate}
          </span>
          <span className="student-program-meta__highlight">
            Register closes on: <strong>{program.registrationDeadline}</strong>
          </span>
          <span>Open to: {program.openTo}</span>
          <span className="student-program-meta__openings">
            Seats: <strong>{program.availableSeats}</strong> available of{" "}
            <strong>{program.seats}</strong>
          </span>
          <span>by {program.company}</span>
        </div>

        <button
          type="button"
          className="student-learn-more-btn"
          onClick={() => onOpen(program)}
        >
          {isRegistering ? "Learn more and apply" : "Learn more"}
        </button>
      </div>
    </div>
  );
}

export default StudentCard;
