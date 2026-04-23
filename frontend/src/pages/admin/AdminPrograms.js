import React, { useMemo, useState } from "react";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalTopbar from "../../components/portal/PortalTopbar";
import CompanyProgramCard from "../../components/company/CompanyProgramCard";
import CompanyProgramModal from "../../components/company/CompanyProgramModal";
import CompanyConfirmModal from "../../components/company/CompanyConfirmModal";
import { adminPrograms as initialPrograms } from "../../data/adminData";

const PROGRAMS_PER_PAGE = 6;

const adminNavItems = [
  { key: "dashboard", label: "Dashboard", path: "/admin/dashboard" },
  { key: "programs", label: "Programs", path: "/admin/programs" },
  { key: "participants", label: "Participants", path: "/admin/participants" },
  { key: "companies", label: "Companies", path: "/admin/companies" },
  { key: "users", label: "Users", path: "/admin/users" },
];

function AdminPrograms() {
  const [programs, setPrograms] = useState(initialPrograms);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [toast, setToast] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(programs.length / PROGRAMS_PER_PAGE));

  const paginatedPrograms = useMemo(() => {
    const start = (currentPage - 1) * PROGRAMS_PER_PAGE;
    return programs.slice(start, start + PROGRAMS_PER_PAGE);
  }, [programs, currentPage]);

  const handleSaveProgram = (programData) => {
    if (programData.id) {
      setPrograms((prev) =>
        prev.map((item) => (item.id === programData.id ? programData : item))
      );
      setEditingProgram(null);
      setToast("Program updated successfully.");
    } else {
      setPrograms((prev) => [
        {
          ...programData,
          id: Date.now(),
          companyName: "Admin Added",
        },
        ...prev,
      ]);
      setShowAddModal(false);
      setCurrentPage(1);
      setToast("Program created successfully.");
    }

    setTimeout(() => setToast(""), 3000);
  };

  const handleConfirmComplete = (program) => {
    setConfirmAction({
      type: "complete",
      program,
      title: "Mark program as completed?",
      message: `Are you sure you want to mark "${program.title}" as completed?`,
      confirmText: "Yes, Complete",
      variant: "success",
    });
  };

  const handleConfirmRemove = (program) => {
    setConfirmAction({
      type: "remove",
      program,
      title: "Remove program?",
      message: `Are you sure you want to remove "${program.title}"? This action cannot be undone.`,
      confirmText: "Yes, Remove",
      variant: "danger",
    });
  };

  const runConfirmedAction = () => {
    if (!confirmAction) return;

    if (confirmAction.type === "complete") {
      setPrograms((prev) =>
        prev.map((item) =>
          item.id === confirmAction.program.id
            ? { ...item, status: "Completed" }
            : item
        )
      );
      setToast("Program marked as completed.");
    }

    if (confirmAction.type === "remove") {
      const updated = programs.filter((item) => item.id !== confirmAction.program.id);
      setPrograms(updated);
      setToast("Program removed successfully.");

      const nextTotalPages = Math.max(1, Math.ceil(updated.length / PROGRAMS_PER_PAGE));
      if (currentPage > nextTotalPages) {
        setCurrentPage(nextTotalPages);
      }
    }

    setConfirmAction(null);
    setTimeout(() => setToast(""), 3000);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PortalLayout
      activeKey="programs"
      navItems={adminNavItems}
      profilePath="/admin/profile"
    >
      <PortalTopbar title="Programs" companyName="Abdulaziz" />

      {toast && (
        <div className="portal-save-toast">
          <div className="portal-save-toast__content">{toast}</div>
          <div className="portal-save-toast__progress"></div>
        </div>
      )}

      <section className="portal-panel admin-programs-page">
        <div className="portal-panel__head between">
          <div>
            <h2>All Programs</h2>
            <p>Manage all companies programs across the system.</p>
          </div>

          <button
            type="button"
            className="company-add-btn"
            onClick={() => setShowAddModal(true)}
          >
            Add New
          </button>
        </div>

        <div className="admin-programs-grid">
          {paginatedPrograms.map((program, index) => (
            <div key={program.id} className="admin-program-wrapper">
              <CompanyProgramCard
                program={program}
                colorIndex={index}
                onEdit={setEditingProgram}
                onComplete={handleConfirmComplete}
                onRemove={handleConfirmRemove}
              />

              <div className="admin-program-company-footer">
                Program by <strong>{program.companyName}</strong>
              </div>
            </div>
          ))}
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
      </section>

      {showAddModal && (
        <CompanyProgramModal
          mode="add"
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveProgram}
        />
      )}

      {editingProgram && (
        <CompanyProgramModal
          mode="edit"
          program={editingProgram}
          onClose={() => setEditingProgram(null)}
          onSave={handleSaveProgram}
        />
      )}

      {confirmAction && (
        <CompanyConfirmModal
          title={confirmAction.title}
          message={confirmAction.message}
          confirmText={confirmAction.confirmText}
          variant={confirmAction.variant}
          onConfirm={runConfirmedAction}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </PortalLayout>
  );
}

export default AdminPrograms;