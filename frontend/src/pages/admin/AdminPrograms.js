import React, { useEffect, useMemo, useState } from "react";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalTopbar from "../../components/portal/PortalTopbar";
import CompanyProgramCard from "../../components/company/CompanyProgramCard";
import CompanyProgramModal from "../../components/company/CompanyProgramModal";
import CompanyConfirmModal from "../../components/company/CompanyConfirmModal";
import {
  getOpportunities,
  updateOpportunity,
  deleteOpportunity,
} from "../../api/opportunityAPI";
import {
  getProgramDisplayStatus,
  getRegistrationDeadlineValue,
  programStatusRank,
} from "../../utils/programStatus";
import defaultProgramImage from "../../assets/default-program-image.jpg";

const PROGRAMS_PER_PAGE = 6;

const adminNavItems = [
  { key: "dashboard", label: "Dashboard", path: "/admin/dashboard" },
  { key: "programs", label: "Programs", path: "/admin/programs" },
  { key: "participants", label: "Participants", path: "/admin/participants" },
  { key: "companies", label: "Companies", path: "/admin/companies" },
  { key: "users", label: "Users", path: "/admin/users" },
];

const normalizeProgram = (item) => {
  const seats = Number(item.seats) || 0;
  const usedSeats = Number(item.usedSeats) || 0;
  const availableSeats =
    item.availableSeats !== undefined
      ? Number(item.availableSeats)
      : Math.max(seats - usedSeats, 0);

  const applicantsCount =
    item.applicantsCount != null ? Number(item.applicantsCount) : null;

  return {
    id: item._id,
    title: item.title || "",
    subtitle: item.subtitle || "",
    description: item.description || "",
    rules: item.rules || "",
    qualifications: item.qualifications || "",
    location: item.location || "",
    seats,
    usedSeats,
    availableSeats,
    applicantsCount,
    dateFrom: item.dateFrom ? item.dateFrom.slice(0, 10) : "",
    dateTo: item.dateTo ? item.dateTo.slice(0, 10) : "",
    registrationDeadline: getRegistrationDeadlineValue(item),
    image: item.imageURL || "",
    displayImage: item.imageURL || defaultProgramImage,
    companyName: item.companyID?.companyName || "Unknown Company",
    status: getProgramDisplayStatus(item),
  };
};

function AdminPrograms() {
  const [programs, setPrograms] = useState([]);
  const [editingProgram, setEditingProgram] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [toast, setToast] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await getOpportunities();
        setPrograms(res.data.map(normalizeProgram));
      } catch (err) {
        setToast("Failed to load programs.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const sortedPrograms = useMemo(() => {
    return [...programs].sort((a, b) => {
      const statusOrder = programStatusRank(a.status) - programStatusRank(b.status);
      if (statusOrder !== 0) return statusOrder;
      return new Date(a.dateFrom || 0) - new Date(b.dateFrom || 0);
    });
  }, [programs]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedPrograms.length / PROGRAMS_PER_PAGE)
  );

  const paginatedPrograms = useMemo(() => {
    const start = (currentPage - 1) * PROGRAMS_PER_PAGE;
    return sortedPrograms.slice(start, start + PROGRAMS_PER_PAGE);
  }, [sortedPrograms, currentPage]);

  const handleSaveProgram = async (programData) => {
    try {
      const payload = {
        title: programData.title,
        subtitle: programData.subtitle,
        description: programData.description,
        rules: programData.rules,
        qualifications: programData.qualifications || "",
        location: programData.location,
        seats: Number(programData.seats),
        dateFrom: programData.dateFrom,
        dateTo: programData.dateTo,
        registrationDeadline: programData.registrationDeadline,
        imageURL: programData.image.trim(),
        status: programData.status === "Completed" ? "Completed" : "Active",
      };

      const res = await updateOpportunity(programData.id, payload);
      const updated = normalizeProgram(res.data.opportunity);

      setPrograms((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );

      setEditingProgram(null);
      setToast("Program updated successfully.");
    } catch (err) {
      setToast(err.response?.data?.message || "Program update failed.");
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
      message: `Are you sure you want to delete "${program.title}"?`,
      confirmText: "Yes, Remove",
      variant: "danger",
    });
  };

  const runConfirmedAction = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.type === "complete") {
        const res = await updateOpportunity(confirmAction.program.id, {
          status: "Completed",
        });

        const updated = normalizeProgram(res.data.opportunity);

        setPrograms((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );

        setToast("Program marked as completed.");
      }

      if (confirmAction.type === "remove") {
        await deleteOpportunity(confirmAction.program.id);

        const updatedPrograms = programs.filter(
          (item) => item.id !== confirmAction.program.id
        );

        setPrograms(updatedPrograms);

        const nextTotalPages = Math.max(
          1,
          Math.ceil(updatedPrograms.length / PROGRAMS_PER_PAGE)
        );

        if (currentPage > nextTotalPages) {
          setCurrentPage(nextTotalPages);
        }

        setToast("Program deleted successfully.");
      }
    } catch (err) {
      setToast(err.response?.data?.message || "Action failed.");
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
      <PortalTopbar title="Programs" />

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
        </div>

        {isLoading ? (
          <p>Loading programs...</p>
        ) : (
          <>
            <div className="admin-programs-grid">
              {paginatedPrograms.map((program, index) => (
                <CompanyProgramCard
                  key={program.id}
                  program={program}
                  colorIndex={index}
                  onEdit={setEditingProgram}
                  onComplete={handleConfirmComplete}
                  onRemove={handleConfirmRemove}
                  footerContent={
                    <span className="admin-program-company-footer">
                      Program by <strong>{program.companyName}</strong>
                    </span>
                  }
                />
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
