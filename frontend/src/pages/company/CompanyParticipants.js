import React, { useMemo, useState } from "react";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalTopbar from "../../components/portal/PortalTopbar";
import CompanyParticipantModal from "../../components/company/CompanyParticipantModal";
import { companyParticipants as initialParticipants } from "../../data/companyData";

const PARTICIPANTS_PER_PAGE = 8;

function CompanyParticipants() {
  const [participants, setParticipants] = useState(initialParticipants);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [toast, setToast] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const companyNavItems = [
    { key: "dashboard", label: "Dashboard", path: "/company/dashboard" },
    { key: "programs", label: "Programs", path: "/company/programs" },
    { key: "participants", label: "Participants", path: "/company/participants" },
  ];

  const totalPages = Math.max(
    1,
    Math.ceil(participants.length / PARTICIPANTS_PER_PAGE)
  );

  const paginatedParticipants = useMemo(() => {
    const start = (currentPage - 1) * PARTICIPANTS_PER_PAGE;
    return participants.slice(start, start + PARTICIPANTS_PER_PAGE);
  }, [participants, currentPage]);

  const handleSaveParticipant = (participantId, updates) => {
    setParticipants((prev) =>
      prev.map((item) =>
        item.id === participantId ? { ...item, ...updates } : item
      )
    );

    setSelectedParticipant(null);
    setToast("Participant status and note updated successfully.");
    setTimeout(() => setToast(""), 3000);
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
      <PortalTopbar title="Participants" companyName="Creative Tech" />

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
                      className={`company-status-badge ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="company-note-cell">{item.note}</td>
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

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={currentPage === page ? "active" : ""}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </section>

      {selectedParticipant && (
        <CompanyParticipantModal
          participant={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
          onSave={handleSaveParticipant}
        />
      )}
    </PortalLayout>
  );
}

export default CompanyParticipants;