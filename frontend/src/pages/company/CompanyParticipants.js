import React, { useEffect, useMemo, useState } from "react";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalTopbar from "../../components/portal/PortalTopbar";
import CompanyParticipantModal from "../../components/company/CompanyParticipantModal";
import {
  getCompanyApplications,
  updateApplicationStatus,
} from "../../api/applicationAPI";

const PARTICIPANTS_PER_PAGE = 8;

const normalizeParticipant = (item) => {
  const student = item.studentID || {};
  const program = item.programID || {};

  return {
    id: item._id,
    name:
      student.firstName && student.lastName
        ? `${student.firstName} ${student.lastName}`
        : student.name || "Student",
    email: student.email || "",
    studentId: student.universityID || student.studentId || "N/A",
    year: student.year || "N/A",
    major: student.major || "N/A",
    skills: Array.isArray(student.skills)
      ? student.skills.join(", ")
      : student.skills || "N/A",
    program: program.title || "Program",
    status: item.status || "Submitted",
    note: item.decisionNote || "-",
    dateApplied: item.appliedDate
      ? item.appliedDate.slice(0, 10)
      : item.createdAt
      ? item.createdAt.slice(0, 10)
      : "N/A",
  };
};

function CompanyParticipants() {
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const companyNavItems = [
    { key: "dashboard", label: "Dashboard", path: "/company/dashboard" },
    { key: "programs", label: "Programs", path: "/company/programs" },
    {
      key: "participants",
      label: "Participants",
      path: "/company/participants",
    },
  ];

  const fetchParticipants = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await getCompanyApplications();
      setParticipants(res.data.map(normalizeParticipant));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load participants. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const totalPages = Math.max(
    1,
    Math.ceil(participants.length / PARTICIPANTS_PER_PAGE)
  );

  const paginatedParticipants = useMemo(() => {
    const start = (currentPage - 1) * PARTICIPANTS_PER_PAGE;
    return participants.slice(start, start + PARTICIPANTS_PER_PAGE);
  }, [participants, currentPage]);

  const handleSaveParticipant = async (participantId, note, status) => {
    setIsSaving(true);

    try {
      await updateApplicationStatus(participantId, status, note);

      setParticipants((prev) =>
        prev.map((item) =>
          item.id === participantId
            ? {
                ...item,
                note,
                status,
              }
            : item
        )
      );

      setSelectedParticipant(null);
      setToast("Participant status and note updated successfully.");
    } catch (err) {
      setToast(
        err.response?.data?.message ||
          "Could not update participant. Please try again."
      );
    } finally {
      setIsSaving(false);
      setTimeout(() => setToast(""), 3000);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PortalLayout
      activeKey="participants"
      navItems={companyNavItems}
      profilePath="/company/profile"
    >
      <PortalTopbar title="Participants" />

      {toast && (
        <div className="portal-save-toast">
          <div className="portal-save-toast__content">{toast}</div>
          <div className="portal-save-toast__progress"></div>
        </div>
      )}

      <section className="portal-panel">
        <div className="portal-panel__head">
          <h2>Application Requests</h2>
          <p>
            Click any row to open application details and update notes or status.
          </p>
        </div>

        {isLoading ? (
          <p>Loading participants...</p>
        ) : error ? (
          <p className="company-form-error">{error}</p>
        ) : participants.length === 0 ? (
          <p>No applications found yet.</p>
        ) : (
          <>
            <div className="company-table-wrap">
              <table className="company-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Year</th>
                    <th>Program</th>
                    <th>Status</th>
                    <th>Note</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedParticipants.map((item) => (
                    <tr
                      key={item.id}
                      className="clickable-row"
                      onClick={() => setSelectedParticipant(item)}
                    >
                      <td>{item.name}</td>
                      <td>{item.studentId}</td>
                      <td>{item.year}</td>
                      <td>{item.program}</td>
                      <td>
                        <span
                          className={`company-status-badge ${item.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="company-note-cell">
                        {item.note || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="company-pagination">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      className={currentPage === page ? "active" : ""}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {selectedParticipant && (
        <CompanyParticipantModal
          participant={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
          onSave={handleSaveParticipant}
          isSaving={isSaving}
        />
      )}
    </PortalLayout>
  );
}

export default CompanyParticipants;