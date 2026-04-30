import React, { useEffect, useState } from "react";

import { getExternalUrl } from "../../utils/formatLinks";

function AdminCompanyDetailsModal({ company, onClose, onSave, isSaving }) {
  const [status, setStatus] = useState(() => company?.status || "Under Review");
  const companyId = company?.id;
  const companyStatus = company?.status;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (companyId) {
      setStatus(companyStatus || "Under Review");
    }
  }, [companyId, companyStatus]);

  if (!company) return null;

  const handleSave = () => {
    onSave(company.id, status);
  };

  return (
    <div className="company-modal-overlay" onClick={onClose}>
      <div className="admin-company-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-company-modal__header">
          <div className="admin-company-modal__identity">
            <div className="admin-company-modal__avatar">
              {company.companyName?.charAt(0)}
            </div>

            <div>
              <div className="admin-company-modal__title-row">
                <h3>{company.companyName}</h3>
                <span
                  className={`admin-company-status-badge ${status
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {status}
                </span>
              </div>
            </div>
          </div>

          <button type="button" className="admin-company-modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="admin-company-modal__body">
          <div className="admin-company-modal__section-title">Details</div>

          <div className="admin-company-modal__grid">
            <div>
              <label>Request ID</label>
              <p>{company.requestId}</p>
            </div>

            <div>
              <label>Industry</label>
              <p>{company.industry}</p>
            </div>

            <div>
              <label>Email</label>
              <p>{company.companyEmail}</p>
            </div>

            <div>
              <label>Phone</label>
              <p>{company.phone}</p>
            </div>

            <div>
              <label>Website</label>
              <p>
                {company.website ? (
                  <a
                    href={getExternalUrl(company.website)}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-external-link"
                  >
                    {company.website}
                  </a>
                ) : (
                  "-"
                )}
              </p>
            </div>

            <div>
              <label>Company Size</label>
              <p>{company.companySize || "-"}</p>
            </div>

            <div>
              <label>Location</label>
              <p>{company.location}</p>
            </div>

            <div>
              <label>Founded Year</label>
              <p>{company.foundedYear || "-"}</p>
            </div>

            <div>
              <label>Contact Person</label>
              <p>{company.contactPerson || "-"}</p>
            </div>

            <div>
              <label>Request Date</label>
              <p>{company.requestDate}</p>
            </div>

            <div>
              <label>Information Confirmed</label>
              <p>{company.confirmInfo ? "Yes" : "No"}</p>
            </div>
          </div>

          <div className="admin-company-modal__full">
            <label>Company Description</label>
            <p>{company.companyDescription || "-"}</p>
          </div>

          <div className="admin-company-modal__full">
            <label>Why do you want to join?</label>
            <p>{company.joinReason || "-"}</p>
          </div>

          <div className="admin-company-modal__status-box">
            <label>Update Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Under Review">Under Review</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="admin-company-modal__actions">
          <button type="button" className="secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminCompanyDetailsModal;
