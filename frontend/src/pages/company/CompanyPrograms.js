import React, { useEffect, useMemo, useState } from "react";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalTopbar from "../../components/portal/PortalTopbar";
import CompanyProgramCard from "../../components/company/CompanyProgramCard";
import CompanyProgramModal from "../../components/company/CompanyProgramModal";
import CompanyConfirmModal from "../../components/company/CompanyConfirmModal";
import { useAuth } from "../../context/AuthContext";
import {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from "../../api/opportunityAPI";
import {
  getProgramDisplayStatus,
  getRegistrationDeadlineValue,
  programStatusRank,
} from "../../utils/programStatus";
import defaultProgramImage from "../../assets/default-program-image.jpg";

const PROGRAMS_PER_PAGE = 9;

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
    seats,
    usedSeats,
    availableSeats,
    applicantsCount,
    location: item.location || "",
    dateFrom: item.dateFrom ? item.dateFrom.slice(0, 10) : "",
    dateTo: item.dateTo ? item.dateTo.slice(0, 10) : "",
    registrationDeadline: getRegistrationDeadlineValue(item),
    image: item.imageURL || "",
    displayImage: item.imageURL || defaultProgramImage,
    status: getProgramDisplayStatus(item),
  };
};

function CompanyPrograms() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const companyNavItems = [
    { key: "dashboard", label: "Dashboard", path: "/company/dashboard" },
    { key: "programs", label: "Programs", path: "/company/programs" },
    { key: "participants", label: "Participants", path: "/company/participants" },
  ];

  const fetchPrograms = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await getOpportunities();
      const companyId = user?.id && String(user.id);
      const rows = !companyId
        ? res.data
        : res.data.filter((p) => {
            const owner = p.companyID?._id || p.companyID;
            return owner && String(owner) === companyId;
          });
      setPrograms(rows.map(normalizeProgram));
    } catch (err) {
      setError(err.response?.data?.message || "Could not load programs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchPrograms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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
      };

      if (programData.id) {
        const res = await updateOpportunity(programData.id, payload);
        const updatedProgram = normalizeProgram(res.data.opportunity || res.data);

        setPrograms((prev) =>
          prev.map((item) => (item.id === programData.id ? updatedProgram : item))
        );

        setEditingProgram(null);
        setToast("Program updated successfully.");
      } else {
        const res = await createOpportunity(payload);
        const createdProgram = normalizeProgram(res.data.opportunity || res.data);

        setPrograms((prev) => [createdProgram, ...prev]);
        setShowAddModal(false);
        setCurrentPage(1);
        setToast("Program created successfully.");
      }

      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      setToast(err.response?.data?.message || "Could not save program.");
      setTimeout(() => setToast(""), 3000);
    }
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

  const runConfirmedAction = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.type === "complete") {
        const res = await updateOpportunity(confirmAction.program.id, {
          status: "Completed",
        });

        const updatedProgram = normalizeProgram(res.data.opportunity || res.data);

        setPrograms((prev) =>
          prev.map((item) =>
            item.id === confirmAction.program.id ? updatedProgram : item
          )
        );

        setToast("Program marked as completed.");
      }

      if (confirmAction.type === "remove") {
        await deleteOpportunity(confirmAction.program.id);

        const updated = programs.filter(
          (item) => item.id !== confirmAction.program.id
        );

        setPrograms(updated);
        setToast("Program removed successfully.");

        const nextTotalPages = Math.max(
          1,
          Math.ceil(updated.length / PROGRAMS_PER_PAGE)
        );

        if (currentPage > nextTotalPages) {
          setCurrentPage(nextTotalPages);
        }
      }
    } catch (err) {
      setToast(err.response?.data?.message || "Action failed.");
    } finally {
      setConfirmAction(null);
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
      activeKey="programs"
      navItems={companyNavItems}
      profilePath="/company/profile"
    >
      <PortalTopbar title="Programs" />

      {toast && (
        <div className="portal-save-toast">
          <div className="portal-save-toast__content">{toast}</div>
          <div className="portal-save-toast__progress"></div>
        </div>
      )}

      <section className="portal-panel company-programs-section">
        <div className="portal-panel__head between">
          <div>
            <h2>Our Programs</h2>
            <p>Manage your programs, update status, and edit details.</p>
          </div>

          <button
            type="button"
            className="company-add-btn"
            onClick={() => setShowAddModal(true)}
          >
            Add New
          </button>
        </div>

        {isLoading ? (
          <p>Loading programs...</p>
        ) : error ? (
          <p className="company-form-error">{error}</p>
        ) : (
          <>
            <div className="company-programs-grid">
              {paginatedPrograms.map((program, index) => (
                <CompanyProgramCard
                  key={program.id}
                  program={program}
                  colorIndex={index}
                  onEdit={setEditingProgram}
                  onComplete={handleConfirmComplete}
                  onRemove={handleConfirmRemove}
                />
              ))}
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

export default CompanyPrograms;
