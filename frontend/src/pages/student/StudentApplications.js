import React, { useEffect, useState } from "react";
import StudentTopbar from "../../components/student/StudentTopbar";
import StudentFooter from "../../components/student/StudentFooter";
import {
  getMyApplications,
  cancelApplication,
} from "../../api/applicationAPI";

const normalizeApplication = (item) => {
  const program = item.programID || {};
  const company = program.companyID || {};

  return {
    id: item._id,
    company: company.companyName || company.email || "Company",
    opportunity: program.title || "Program",
    status: item.status || "Submitted",
    note: item.decisionNote || "-",
  };
};

function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const getStatusClass = (status) => {
    if (status === "Accepted") return "accepted";
    if (status === "Rejected") return "rejected";
    return "review";
  };

  const fetchApplications = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await getMyApplications();
      setApplications(res.data.map(normalizeApplication));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load your applications. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleRemoveClick = (item) => {
    setSelectedApplication(item);
  };

  const handleConfirmRemove = async () => {
    if (!selectedApplication) return;

    setIsRemoving(true);

    try {
      await cancelApplication(selectedApplication.id);

      setApplications((prev) =>
        prev.filter((item) => item.id !== selectedApplication.id)
      );

      setSelectedApplication(null);
      setToast("Application removed successfully.");
    } catch (err) {
      setToast(
        err.response?.data?.message ||
          "Could not remove application. Please try again."
      );
    } finally {
      setIsRemoving(false);
      setTimeout(() => setToast(""), 3000);
    }
  };

  return (
    <div className="student-page">
      <StudentTopbar />

      {toast && (
        <div className="student-save-toast">
          <div className="student-save-toast__content">{toast}</div>
          <div className="student-save-toast__progress"></div>
        </div>
      )}

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
                disabled={isRemoving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="student-confirm-remove"
                onClick={handleConfirmRemove}
                disabled={isRemoving}
              >
                {isRemoving ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="student-applications-page container">
        <div className="student-applications-card">
          <h2>My Applications</h2>
          <p>Track the opportunities you applied for</p>

          {isLoading ? (
            <p>Loading applications...</p>
          ) : error ? (
            <p className="student-form-error">{error}</p>
          ) : (
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
          )}
        </div>
      </main>

      <StudentFooter />
    </div>
  );
}

export default StudentApplications;