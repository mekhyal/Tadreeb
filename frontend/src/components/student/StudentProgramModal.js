import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { PROGRAM_STATUS } from "../../utils/programStatus";

function StudentProgramModal({ program, onClose, onApply, isApplying }) {
  useEffect(() => {
    if (program) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [program]);

  if (!program) return null;

  const canApply =
    program.status === PROGRAM_STATUS.register && program.availableSeats > 0;

  return (
    <div className="student-modal-overlay" onClick={onClose}>
      <div className="student-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="student-modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        <h2>{program.title}</h2>

        <div className="student-modal-section">
          <h4>General Description</h4>
          <p>{program.fullDescription}</p>
        </div>

        <div className="student-modal-section">
          <h4>Start - End Date</h4>
          <div className="student-modal-dates">
            <div>
              <span>Start Date</span>
              <strong>{program.startDate}</strong>
            </div>

            <div>
              <span>End Date</span>
              <strong>{program.endDate}</strong>
            </div>
          </div>
        </div>

        <div className="student-modal-section">
          <h4>Positions</h4>
          <p>
            The company will accept up to <strong>{program.seats}</strong> interns.{" "}
            <strong>{program.availableSeats}</strong> spots are still open based on
            who has already been accepted (applying does not hold a seat until then).
          </p>
          <p className="student-modal-application-close">
            Register closes on: <strong>{program.registrationDeadline}</strong>.
          </p>
        </div>

        {program.qualifications && String(program.qualifications).trim() ? (
          <div className="student-modal-section">
            <h4>What they are looking for</h4>
            <p>{program.qualifications}</p>
          </div>
        ) : null}

        <div className="student-modal-section">
          <h4>Rules</h4>
          {program.rules.length > 0 ? (
            <ul>
              {program.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          ) : (
            <p>No rules provided.</p>
          )}
        </div>

        <div className="student-modal-section">
          <h4>Location</h4>
          <p>{program.location}</p>
        </div>

        <button
          type="button"
          className={`student-apply-btn ${
            program.applied || !canApply ? "applied" : ""
          }`}
          onClick={() => onApply(program.id)}
          disabled={program.applied || !canApply || isApplying}
        >
          {isApplying
            ? "Applying..."
            : !canApply
            ? program.availableSeats <= 0
              ? "No Seats Available"
              : "Applications Closed"
            : program.applied
            ? "Applied"
            : "Apply Now"}
        </button>

        {program.actionMessage && (
          <p
            className={`student-action-message ${
              program.actionType === "success" ? "success" : "error"
            }`}
          >
            {program.actionMessage}
          </p>
        )}

        {program.applied && !program.actionMessage && (
          <p className="student-action-message success">
            Your application status:{" "}
            <strong>{program.applicationStatus || "Submitted"}</strong>
          </p>
        )}

        {!canApply && !program.applied && !program.actionMessage && (
          <p className="student-action-message error">
            {program.availableSeats <= 0
              ? "No seats are currently available for this program."
              : program.status === PROGRAM_STATUS.active
              ? "Application is active now."
              : "Registration is closed for this program."}
          </p>
        )}
      </div>
    </div>
  );
}

export default StudentProgramModal;
