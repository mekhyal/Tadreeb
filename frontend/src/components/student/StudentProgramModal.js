import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

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

  const isClosed = program.status === "Complete";

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
            program.applied || isClosed ? "applied" : ""
          }`}
          onClick={() => onApply(program.id)}
          disabled={program.applied || isClosed || isApplying}
        >
          {isApplying
            ? "Applying..."
            : isClosed
            ? "Program Full"
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
            Your application has been submitted. Status: Pending.
          </p>
        )}

        {isClosed && !program.actionMessage && (
          <p className="student-action-message error">
            This program is full and cannot accept more students.
          </p>
        )}
      </div>
    </div>
  );
}

export default StudentProgramModal;