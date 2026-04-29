import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import StudentTopbar from "../../components/student/StudentTopbar";
import StudentFooter from "../../components/student/StudentFooter";
import {
  getMyApplications,
  cancelApplication,
} from "../../api/applicationAPI";
import {
  PROGRAM_STATUS,
  getProgramDisplayStatus,
  getRegistrationDeadlineValue,
} from "../../utils/programStatus";

const normalizeApplication = (item) => {
  const program = item.programID || {};
  const company = program.companyID || {};
  const endDate = program.dateTo ? program.dateTo.slice(0, 10) : "";
  const registrationDeadline = getRegistrationDeadlineValue(program);

  return {
    id: String(item._id || item.id || ""),
    company: company.companyName || company.email || "Company",
    opportunity: program.title || "Program",
    startDate: program.dateFrom ? program.dateFrom.slice(0, 10) : "",
    endDate,
    registrationDeadline,
    canRemove:
      !registrationDeadline ||
      new Date(registrationDeadline).setHours(23, 59, 59, 999) >=
        new Date().getTime(),
    status: item.status || "Submitted",
    programStatus: getProgramDisplayStatus(program),
    note: item.decisionNote || "-",
  };
};

function StudentApplications() {
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [error, setError] = useState("");

  const getStatusClass = (status) => {
    if (status === "Accepted") return "accepted";
    if (status === "Rejected") return "rejected";
    if (status === "Not Reviewed") return "not-reviewed";
    return "review";
  };

  const activeApplications = useMemo(
    () =>
      applications.filter(
        (item) => item.programStatus !== PROGRAM_STATUS.completed
      ),
    [applications]
  );

  const completedApplications = useMemo(
    () =>
      applications.filter(
        (item) => item.programStatus === PROGRAM_STATUS.completed
      ),
    [applications]
  );

  const renderApplicationsTable = (
    items,
    isCompletedSection = false,
    emptyMessage = "You do not have any applications yet."
  ) => (
    <div className="student-applications-table-wrap">
      <table className="student-applications-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Opportunity</th>
            <th>Program Dates</th>
            <th>Status</th>
            <th>Note</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.company}</td>
                <td>{item.opportunity}</td>
                <td>
                  {item.startDate && item.endDate
                    ? `${item.startDate} to ${item.endDate}`
                    : "-"}
                </td>
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
                  {isCompletedSection ? (
                    <span className="student-completed-action">Completed</span>
                  ) : (
                    <button
                      type="button"
                      className="student-remove-application-btn"
                      onClick={() => handleRemoveClick(item)}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="student-empty-applications">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const fetchApplications = useCallback(async (showSpinner = true) => {
    if (showSpinner) {
      setIsLoading(true);
      setError("");
    }

    try {
      const res = await getMyApplications();
      setApplications((res.data || []).map(normalizeApplication));
    } catch (err) {
      if (showSpinner) {
        setError(
          err.response?.data?.message ||
            "Could not load your applications. Please try again."
        );
      }
    } finally {
      if (showSpinner) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchApplications(true);
  }, [location.pathname, fetchApplications]);

  useEffect(() => {
    const refetchQuiet = () => {
      if (document.visibilityState === "visible") {
        fetchApplications(false);
      }
    };

    const onFocus = () => fetchApplications(false);

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", refetchQuiet);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", refetchQuiet);
    };
  }, [fetchApplications]);

  const handleRemoveClick = (item) => {
    if (!item.canRemove) {
      setToast({
        type: "warning",
        message:
          "Registration is closed for this program, so you cannot remove this application yourself. Please contact Tadreeb support and we will help you with the request.",
      });
      setTimeout(() => setToast({ message: "", type: "success" }), 8000);
      return;
    }

    setSelectedApplication(item);
  };

  const handleConfirmRemove = async () => {
    if (!selectedApplication) return;

    setIsRemoving(true);

    try {
      await cancelApplication(selectedApplication.id);

      setApplications((prev) =>
        prev.filter(
          (item) => String(item.id) !== String(selectedApplication.id)
        )
      );

      setSelectedApplication(null);
      setToast({
        type: "success",
        message: "Application removed successfully.",
      });
    } catch (err) {
      setSelectedApplication(null);
      setToast({
        type: "warning",
        message:
          err.response?.data?.message ||
          "Could not remove application. Please contact Tadreeb support if registration is closed.",
      });
    } finally {
      setIsRemoving(false);
      setTimeout(() => setToast({ message: "", type: "success" }), 8000);
    }
  };

  return (
    <div className="student-page">
      <StudentTopbar />

      {toast.message && (
        <div
          className={`student-save-toast ${
            toast.type === "warning" ? "warning" : ""
          }`}
        >
          <div className="student-save-toast__content">{toast.message}</div>
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
            renderApplicationsTable(
              activeApplications,
              false,
              completedApplications.length > 0
                ? "You do not have any active applications right now."
                : "You do not have any applications yet."
            )
          )}
        </div>

        {!isLoading && !error && completedApplications.length > 0 && (
          <div className="student-applications-card student-completed-applications-card">
            <h2>Completed Programs</h2>
            <p>Programs that have been marked completed by the company or admin</p>

            {renderApplicationsTable(completedApplications, true)}
          </div>
        )}
      </main>

      <StudentFooter />
    </div>
  );
}

export default StudentApplications;
