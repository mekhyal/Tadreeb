import React, { useEffect, useMemo, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

function CompanyParticipantModal({ participant, onClose, onSave }) {
  const [note, setNote] = useState(participant?.note || "");
  const [status, setStatus] = useState(participant?.status || "Review");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const avatarTone = useMemo(() => {
    const tones = ["blue", "green", "orange", "purple"];
    return tones[participant.id % tones.length];
  }, [participant]);

  if (!participant) return null;

  const handleSave = () => {
    onSave(participant.id, {
      note,
      status,
    });
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
              <label>Year</label>
              <strong>{participant.year}</strong>
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
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write note here..."
              ></textarea>
            </div>

            <div className="company-form-group full">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Review">Review</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="company-modal-footer">
          <button type="button" className="secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="primary" onClick={handleSave}>
            Save Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompanyParticipantModal;