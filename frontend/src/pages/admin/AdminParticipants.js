import React, { useMemo, useState } from "react";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalTopbar from "../../components/portal/PortalTopbar";
import AdminParticipantModal from "../../components/admin/AdminParticipantModal";
import { adminParticipantApplications as initialParticipants } from "../../data/adminData";

const PARTICIPANTS_PER_PAGE = 7;

const adminNavItems = [
  { key: "dashboard", label: "Dashboard", path: "/admin/dashboard" },
  { key: "programs", label: "Programs", path: "/admin/programs" },
  { key: "participants", label: "Participants", path: "/admin/participants" },
  { key: "companies", label: "Companies", path: "/admin/companies" },
  { key: "users", label: "Users", path: "/admin/users" },
];

function AdminParticipants() {
  const [participants, setParticipants] = useState(initialParticipants);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [toast, setToast] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredParticipants = useMemo(() => {
    if (activeFilter === "All") return participants;
    return participants.filter((item) => item.adminStatus === activeFilter);
  }, [participants, activeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredParticipants.length / PARTICIPANTS_PER_PAGE)
  );

  const paginatedParticipants = useMemo(() => {
    const start = (currentPage - 1) * PARTICIPANTS_PER_PAGE;
    return filteredParticipants.slice(start, start + PARTICIPANTS_PER_PAGE);
  }, [filteredParticipants, currentPage]);

  const handleSaveParticipant = (participantId, updates) => {
    setParticipants((prev) =>
      prev.map((item) =>
        item.id === participantId ? { ...item, ...updates } : item
      )
    );

    setSelectedParticipant(null);
    setToast("Participant application updated successfully.");
    setTimeout(() => setToast(""), 3000);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PortalLayout
      activeKey="participants"
      navItems={adminNavItems}
      profilePath="/admin/profile"
    >
      <PortalTopbar title="Participants" companyName="Abdulaziz" />

      {toast && (
        <div className="portal-save-toast">
          <div className="portal-save-toast__content">{toast}</div>
          <div className="portal-save-toast__progress"></div>
        </div>
      )}

      <section className="portal-panel admin-participants-page">
        <div className="admin-participants-toolbar">
          <div className="admin-participants-filters">
            {["All", "Review", "Accepted", "Rejected"].map((filter) => {
              const count =
                filter === "All"
                  ? participants.length
                  : participants.filter((item) => item.adminStatus === filter).length;

              return (
                <button
                  key={filter}
                  type="button"
                  className={activeFilter === filter ? "active" : ""}
                  onClick={() => handleFilterChange(filter)}
                >
                  {filter} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div className="portal-panel admin-participants-table-panel">
          <div className="portal-panel__head">
            <h2>All Applications</h2>
            <p>Review company decisions and control what the student can see.</p>
          </div>

          <div className="company-table-wrap">
            <table className="company-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Student ID</th>
                  <th>Program</th>
                  <th>Company</th>
                  <th>Final Status</th>
                  <th>Visible</th>
                </tr>
              </thead>

              <tbody>
                {paginatedParticipants.map((item) => (
                  <tr
                    key={item.id}
                    className="clickable-row"
                    onClick={() => setSelectedParticipant(item)}
                  >
                    <td>
                      <div className="admin-company-cell">
                        <div className={`admin-company-avatar tone-${item.id % 4}`}>
                          {item.name.charAt(0)}
                        </div>

                        <div>
                          <strong>{item.name}</strong>
                          <span>{item.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{item.studentId}</td>
                    <td>{item.program}</td>
                    <td>{item.company}</td>
                    <td>
                      <span className={`company-status-badge ${item.adminStatus.toLowerCase()}`}>
                        {item.adminStatus}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`admin-visible-badge ${
                          item.visibleToStudent ? "shown" : "hidden"
                        }`}
                      >
                        {item.visibleToStudent ? "Shown" : "Hidden"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="admin-pagination">
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
        </div>
      </section>

      {selectedParticipant && (
        <AdminParticipantModal
          participant={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
          onSave={handleSaveParticipant}
        />
      )}
    </PortalLayout>
  );
}

export default AdminParticipants;