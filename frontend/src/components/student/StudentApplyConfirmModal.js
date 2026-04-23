import React, { useEffect } from "react";

function StudentApplyConfirmModal({ program, onCancel, onConfirm }) {
  useEffect(() => {
    if (program) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [program]);

  if (!program) return null;

  return (
    <div className="student-modal-overlay" onClick={onCancel}>
      <div className="student-confirm-card" onClick={(e) => e.stopPropagation()}>
        <h3>Confirm Application</h3>
        <p>
          Are you sure you want to apply for{" "}
          <strong>{program.title}</strong>?
        </p>

        <div className="student-confirm-actions">
          <button
            type="button"
            className="student-confirm-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="student-confirm-apply"
            onClick={onConfirm}
          >
            Yes, Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentApplyConfirmModal;