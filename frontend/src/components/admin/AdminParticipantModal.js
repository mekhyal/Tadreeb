import React, { useEffect, useMemo, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

function AdminParticipantModal({ participant, onClose, onSave }) {
  const [adminStatus, setAdminStatus] = useState(
    participant?.adminStatus || participant?.companyStatus || "Review"
  );
  const [visibleToStudent, setVisibleToStudent] = useState(
    participant?.visibleToStudent || false
  );

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
      adminStatus,
      visibleToStudent,
    });
  };

  return (
    <div className="company-modal-overlay" onClick={onClose}>
      <div
        className="company-modal-card compact admin-participant-modal-card"
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
              <label>Company</label>
              <strong>{participant.company}</strong>
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

            <div className="company-detail-box company-detail-box--wide">
              <label>Date Applied</label>
              <strong>{participant.dateApplied}</strong>
            </div>
          </div>

          <div className="admin-participant-review-grid">
            <div className="admin-participant-review-box">
              <label>Company Status</label>
              <div className={`admin-review-badge ${participant.companyStatus.toLowerCase()}`}>
                {participant.companyStatus}
              </div>
            </div>

            <div className="admin-participant-review-box">
              <label>Admin Status</label>
              <div className="admin-user-status-select-wrap">
                <select
                  className="admin-user-status-select"
                  value={adminStatus}
                  onChange={(e) => setAdminStatus(e.target.value)}
                >
                  <option value="Review">Review</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="admin-participant-note-box">
            <label>Company Note</label>
            <div className="admin-participant-note-content">
              {participant.companyNote || "No company note available."}
            </div>
          </div>

          <div className="admin-participant-visibility-card">
            <label className="admin-participant-visibility-label improved">
              <input
                type="checkbox"
                checked={visibleToStudent}
                onChange={(e) => setVisibleToStudent(e.target.checked)}
              />
              <span className="admin-participant-visibility-text">
                Show company note and final status to the student
              </span>
            </label>
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

export default AdminParticipantModal;