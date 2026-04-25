import React, { useState } from "react";
import StudentTopbar from "../../components/student/StudentTopbar";
import StudentFooter from "../../components/student/StudentFooter";
import { applicationData } from "../../data/studentData";

function StudentApplications() {
  const [applications, setApplications] = useState(applicationData);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const getStatusClass = (status) => {
    if (status === "Accepted") return "accepted";
    if (status === "Rejected") return "rejected";
    return "review";
  };

  const handleRemoveClick = (item) => {
    setSelectedApplication(item);
  };

  const handleConfirmRemove = () => {
    setApplications((prev) =>
      prev.filter((item) => item.id !== selectedApplication.id)
    );

    setSelectedApplication(null);
  };

  return (
    <div className="student-page">
      <StudentTopbar />

      {selectedApplication && (
        <div
          className="company-modal-overlay"
          onClick={() => setSelectedApplication(null)}
        >
          <div
            className="student-confirm-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Remove Application?</h3>
            <p>
              Are you sure you want to remove your application for{" "}
              <strong>{selectedApplication.opportunity}</strong>?
            </p>

            <div className="student-confirm-actions">
              <button
                type="button"
                className="student-confirm-cancel"
                onClick={() => setSelectedApplication(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="student-confirm-remove"
                onClick={handleConfirmRemove}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="student-applications-page container">
        <div className="student-applications-card">
          <h2>My Applications</h2>
          <p>Track the opportunities you applied for</p>

          <div className="student-applications-table-wrap">
            <table className="student-applications-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Opportunity</th>
                  <th>Status</th>
                  <th>Note</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {applications.length > 0 ? (
                  applications.map((item) => (
                    <tr key={item.id}>
                      <td>{item.company}</td>
                      <td>{item.opportunity}</td>
                      <td>
                        <span
                          className={`student-status-badge ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>{item.note}</td>
                      <td>
                        <button
                          type="button"
                          className="student-remove-application-btn"
                          onClick={() => handleRemoveClick(item)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="student-empty-applications">
                      You do not have any applications yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <StudentFooter />
    </div>
  );
}

export default StudentApplications;