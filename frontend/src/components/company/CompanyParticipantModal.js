import React, { useEffect, useMemo, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const LIMITS = {
  note: 250,
};

function CompanyParticipantModal({ participant, onClose, onSave, isSaving }) {
  const [note, setNote] = useState(participant?.note || "");
  const [status, setStatus] = useState(participant?.status || "Under Review");
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const avatarTone = useMemo(() => {
    const tones = ["blue", "green", "orange", "purple"];
    return tones[(participant?.id?.length || 0) % tones.length];
  }, [participant]);

  if (!participant) return null;

  const decisionLocked = Boolean(participant.isProgramDecisionLocked);
  const hasFinalDecision = ["Accepted", "Rejected"].includes(status);

  const handleSave = () => {
    if (decisionLocked) {
      setError(
        "Status updates are closed because this program is already active or completed."
      );
      return;
    }

    if (!hasFinalDecision) {
      setError("Please choose Accepted or Rejected before saving.");
      return;
    }

    if (!status) {
      setError("Status is required.");
      return;
    }

    if (note.trim().length > LIMITS.note) {
      setError(`Company note must be ${LIMITS.note} characters or less.`);
      return;
    }

    onSave(participant.id, note.trim(), status);
  };

  return (
    <div className="company-modal-overlay" onClick={onClose}>
      <div
        className="company-modal-card compact"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="company-modal-head">
          <h2>Application Details</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="company-modal-body">
          <div className="company-participant-header">
            <div className={`company-participant-avatar ${avatarTone}`}>
              <FaUserCircle />
            </div>

            <div>
              <h3>{participant.name}</h3>
              <p>{participant.email}</p>
            </div>
          </div>

          <div className="company-participant-grid">
            <div className="company-detail-box">
              <label>Student ID</label>
              <strong>{participant.studentId}</strong>
            </div>

            <div className="company-detail-box">
              <label>Program</label>
              <strong>{participant.program}</strong>
            </div>

            <div className="company-detail-box">
              <label>University Name</label>
              <strong>{participant.universityName}</strong>
            </div>

            <div className="company-detail-box">
              <label>Major</label>
              <strong>{participant.major}</strong>
            </div>

            <div className="company-detail-box">
              <label>Skills</label>
              <strong>{participant.skills}</strong>
            </div>

            <div className="company-detail-box">
              <label>Date Applied</label>
              <strong>{participant.dateApplied}</strong>
            </div>
          </div>

          <div className="company-form company-form--compact">
            <div className="company-form-group full">
              <label>Company Note</label>
              <textarea
                rows="4"
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  setError("");
                }}
                placeholder="Write note here..."
                maxLength={LIMITS.note}
              ></textarea>
            </div>

            <div className="company-form-group full">
              <label>Status</label>
              <select
                value={status}
                disabled={decisionLocked}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setError("");
                }}
              >
                {!["Accepted", "Rejected"].includes(status) && (
                  <option value={status}>{status}</option>
                )}
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {decisionLocked && (
              <p className="company-form-warning">
                Status updates are closed because this program is already active
                or completed.
              </p>
            )}

            {error && <p className="company-form-error">{error}</p>}
          </div>
        </div>

        <div className="company-modal-footer">
          <button type="button" className="secondary" onClick={onClose}>
            Cancel
          </button>

          <button
            type="button"
            className="primary"
            onClick={handleSave}
            disabled={isSaving || decisionLocked || !hasFinalDecision}
          >
            {isSaving ? "Saving..." : "Save Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompanyParticipantModal;
