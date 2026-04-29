import React, { useEffect, useMemo, useState } from "react";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalTopbar from "../../components/portal/PortalTopbar";
import AdminParticipantModal from "../../components/admin/AdminParticipantModal";
import {
  getAdminApplications,
  updateAdminApplicationReview,
} from "../../api/adminAPI";

const PARTICIPANTS_PER_PAGE = 7;

const adminNavItems = [
  { key: "dashboard", label: "Dashboard", path: "/admin/dashboard" },
  { key: "programs", label: "Programs", path: "/admin/programs" },
  { key: "participants", label: "Participants", path: "/admin/participants" },
  { key: "companies", label: "Companies", path: "/admin/companies" },
  { key: "users", label: "Users", path: "/admin/users" },
];

const mapCompanyDecisionToLabel = (s) => {
  if (s === "Under Review") return "Under Review";
  return s || "—";
};

const normalizeAdminApplication = (raw) => {
  const s = raw.studentID || {};
  const p = raw.programID || {};
  const c = p.companyID || {};
  return {
    id: String(raw._id),
    name: [s.firstName, s.lastName].filter(Boolean).join(" ") || "Student",
    email: s.email || "",
    studentId: s.universityID || "N/A",
    year: s.year || "",
    major: s.major || "",
    skills: Array.isArray(s.skills) ? s.skills.join(", ") : s.skills || "",
    program: p.title || "Program",
    company: c.companyName || "Company",
    dateApplied: raw.createdAt ? raw.createdAt.slice(0, 10) : "",
    companyStatus: mapCompanyDecisionToLabel(raw.status),
    companyNote: raw.decisionNote || "-",
    adminStatus: raw.adminStatus || "Review",
    visibleToStudent: raw.visibleToStudent !== false,
  };
};

function AdminParticipants() {
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const loadParticipants = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await getAdminApplications();
      const list = (res.data || []).map(normalizeAdminApplication);
      setParticipants(list);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load applications. Please try again."
      );
      setParticipants([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, []);

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

  const handleSaveParticipant = async (participantId, updates) => {
    try {
      const res = await updateAdminApplicationReview(participantId, {
        visibleToStudent: updates.visibleToStudent,
      });
      const next = normalizeAdminApplication(res.data.application);
      setParticipants((prev) =>
        prev.map((item) =>
          String(item.id) === String(participantId) ? next : item
        )
      );
      setSelectedParticipant(null);
      setToast("Participant application updated successfully.");
    } catch (err) {
      setToast(
        err.response?.data?.message || "Could not save application review."
      );
    } finally {
      setTimeout(() => setToast(""), 3000);
    }
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
      <PortalTopbar title="Participants" />

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
                  : participants.filter((item) => item.adminStatus === filter)
                      .length;

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

          {isLoading ? (
            <p>Loading applications...</p>
          ) : error ? (
            <p className="company-form-error">{error}</p>
          ) : participants.length === 0 ? (
            <p>No student applications in the system yet.</p>
          ) : (
            <div className="company-table-wrap">
              <table className="company-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Program</th>
                    <th>Company</th>
                    <th>Company Status</th>
                    <th>Visible</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedParticipants.map((item, index) => (
                    <tr
                      key={item.id}
                      className="clickable-row"
                      onClick={() => setSelectedParticipant(item)}
                    >
                      <td>
                        <div className="admin-company-cell">
                          <div
                            className={`admin-company-avatar tone-${
                              index % 4
                            }`}
                          >
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
                        <span
                          className={`company-status-badge ${String(
                            item.companyStatus
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {item.companyStatus}
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
          )}

          {!isLoading && !error && totalPages > 1 && (
            <div className="admin-pagination">
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
