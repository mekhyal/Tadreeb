import React, { useEffect, useMemo, useRef, useState } from "react";
import StudentTopbar from "../../components/student/StudentTopbar";
import StudentFooter from "../../components/student/StudentFooter";
import StudentCard from "../../components/student/StudentCard";
import StudentProgramModal from "../../components/student/StudentProgramModal";
import StudentApplyConfirmModal from "../../components/student/StudentApplyConfirmModal";
import { getOpportunities } from "../../api/opportunityAPI";
import { applyToProgram, getMyApplications } from "../../api/applicationAPI";
import {
  PROGRAM_STATUS,
  getProgramDisplayStatus,
  getRegistrationDeadlineValue,
  programStatusRank,
} from "../../utils/programStatus";

const PROGRAMS_PER_PAGE = 6;

const normalizeProgram = (item) => {
  const company = item.companyID || {};
  const seats = Number(item.seats) || 0;
  const usedSeats = Number(item.usedSeats) || 0;
  const availableSeats =
    item.availableSeats !== undefined
      ? Number(item.availableSeats)
      : Math.max(seats - usedSeats, 0);
  const status = getProgramDisplayStatus(item);

  return {
    id: item._id,
    title: item.title || "",
    shortDescription: item.subtitle || item.description || "",
    fullDescription: item.description || "",
    startDate: item.dateFrom ? item.dateFrom.slice(0, 10) : "",
    endDate: item.dateTo ? item.dateTo.slice(0, 10) : "",
    registrationDeadline: getRegistrationDeadlineValue(item),
    rules: Array.isArray(item.rules)
      ? item.rules
      : String(item.rules || "")
          .split("\n")
          .map((rule) => rule.trim())
          .filter(Boolean),
    qualifications: item.qualifications || "",
    location: item.location || "",
    image:
      item.imageURL ||
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    status,
    category: item.category || "Software",
    openTo: item.openTo || "Students",
    company: company.companyName || company.email || "Company",
    seats,
    usedSeats,
    availableSeats,
    applied: false,
    applicationStatus: null,
    actionMessage: "",
    actionType: "",
  };
};

function buildStudentProgramList(programsRes, myAppsRes) {
  const statusByProgramId = new Map();
  (myAppsRes.data || []).forEach((app) => {
    const pid = app.programID?._id || app.programID;
    if (pid) {
      const key = String(pid);
      statusByProgramId.set(key, app.status || "Submitted");
    }
  });

  const normalizedPrograms = programsRes.data.map((item) => {
    const pid = String(item._id);
    return {
      ...normalizeProgram(item),
      id: pid,
      applied: statusByProgramId.has(pid),
      applicationStatus: statusByProgramId.get(pid) ?? null,
    };
  });

  return normalizedPrograms.sort((a, b) => {
    const statusOrder = programStatusRank(a.status) - programStatusRank(b.status);
    if (statusOrder !== 0) return statusOrder;
    return new Date(a.startDate || 0) - new Date(b.startDate || 0);
  });
}

function StudentHome() {
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programToConfirm, setProgramToConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [tempCategory, setTempCategory] = useState("All");
  const [tempFromDate, setTempFromDate] = useState("");
  const [tempToDate, setTempToDate] = useState("");

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isPaging, setIsPaging] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [pageError, setPageError] = useState("");

  const filterRef = useRef(null);

  const categories = [
    "All",
    "Web Development",
    "Mobile",
    "UI/UX",
    "Software",
    "Data",
  ];

  useEffect(() => {
    const load = async (showFullLoader) => {
      if (showFullLoader) {
        setIsPageLoading(true);
        setPageError("");
      }

      try {
        const [programsRes, myAppsRes] = await Promise.all([
          getOpportunities(),
          getMyApplications().catch(() => ({ data: [] })),
        ]);

        const sortedPrograms = buildStudentProgramList(programsRes, myAppsRes);

        setPrograms(sortedPrograms);
      } catch (error) {
        if (showFullLoader) {
          setPageError(
            error.response?.data?.message ||
              "Could not load programs. Please try again."
          );
        }
      } finally {
        if (showFullLoader) {
          setIsPageLoading(false);
        }
      }
    };

    load(true);
  }, []);

  useEffect(() => {
    const refetchQuiet = () => {
      if (document.visibilityState !== "visible") return;

      const run = async () => {
        try {
          const [programsRes, myAppsRes] = await Promise.all([
            getOpportunities(),
            getMyApplications().catch(() => ({ data: [] })),
          ]);

          const sortedPrograms = buildStudentProgramList(programsRes, myAppsRes);

          setPrograms(sortedPrograms);

          setSelectedProgram((prev) => {
            if (!prev) return prev;
            const updated = sortedPrograms.find((p) => p.id === prev.id);
            return updated || prev;
          });
        } catch {
          /* keep existing list */
        }
      };

      run();
    };

    const onFocus = () => refetchQuiet();

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", refetchQuiet);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", refetchQuiet);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowFilterMenu(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesSearch = program.title
        .toLowerCase()
        .includes(activeSearch.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || program.category === selectedCategory;

      const matchesDate =
        (!fromDate && !toDate) ||
        ((!toDate || new Date(program.startDate) <= new Date(toDate)) &&
          (!fromDate || new Date(program.endDate) >= new Date(fromDate)));

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [programs, activeSearch, selectedCategory, fromDate, toDate]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPrograms.length / PROGRAMS_PER_PAGE)
  );

  const paginatedPrograms = useMemo(() => {
    const start = (currentPage - 1) * PROGRAMS_PER_PAGE;
    const end = start + PROGRAMS_PER_PAGE;
    return filteredPrograms.slice(start, end);
  }, [filteredPrograms, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const setProgramMessage = (programId, message, type, applied = false) => {
    const pid = String(programId);
    setPrograms((prev) =>
      prev.map((program) =>
        String(program.id) === pid
          ? {
              ...program,
              applied,
              applicationStatus: applied
                ? program.applicationStatus || "Submitted"
                : program.applicationStatus,
              actionMessage: message,
              actionType: type,
            }
          : program
      )
    );

    setSelectedProgram((prev) =>
      prev && String(prev.id) === pid
        ? {
            ...prev,
            applied,
            applicationStatus: applied
              ? prev.applicationStatus || "Submitted"
              : prev.applicationStatus,
            actionMessage: message,
            actionType: type,
          }
        : prev
    );
  };

  const markAppliedOnProgram = (programId) => {
    const pid = String(programId);
    setPrograms((prev) =>
      prev.map((program) =>
        String(program.id) === pid
          ? { ...program, applied: true, applicationStatus: "Submitted" }
          : program
      )
    );

    setSelectedProgram((prev) =>
      prev && String(prev.id) === pid
        ? { ...prev, applied: true, applicationStatus: "Submitted" }
        : prev
    );
  };

  const runApplyLogic = async (programId) => {
    const targetProgram = programs.find(
      (program) => String(program.id) === String(programId)
    );
    if (!targetProgram) return;

    if (targetProgram.status !== PROGRAM_STATUS.register) {
      setProgramMessage(
        programId,
        targetProgram.status === PROGRAM_STATUS.active
          ? "Application is active now."
          : "Registration is closed for this program.",
        "error"
      );
      return;
    }

    if (targetProgram.availableSeats <= 0) {
      setProgramMessage(
        programId,
        "No seats are currently available for this program.",
        "error"
      );
      return;
    }

    setIsApplying(true);

    try {
      await applyToProgram(programId);

      markAppliedOnProgram(programId);

      setProgramMessage(
        programId,
        "Your application was submitted successfully.",
        "success",
        true
      );
    } catch (error) {
      setProgramMessage(
        programId,
        error.response?.data?.message ||
          "Could not submit application. Please try again.",
        "error"
      );
    } finally {
      setIsApplying(false);
    }
  };

  const handleApplyRequest = (programId) => {
    const targetProgram = programs.find(
      (program) => String(program.id) === String(programId)
    );
    if (!targetProgram) return;

    if (
      targetProgram.status !== PROGRAM_STATUS.register ||
      targetProgram.availableSeats <= 0 ||
      targetProgram.applied
    ) {
      runApplyLogic(programId);
      return;
    }

    setProgramToConfirm(targetProgram);
  };

  const handleConfirmApply = () => {
    if (!programToConfirm) return;
    runApplyLogic(programToConfirm.id);
    setProgramToConfirm(null);
  };

  const handleFilterClick = () => {
    setTempCategory(selectedCategory);
    setTempFromDate(fromDate);
    setTempToDate(toDate);
    setShowFilterMenu((prev) => !prev);
  };

  const handleApplyFilters = () => {
    setIsFiltering(true);

    setTimeout(() => {
      setSelectedCategory(tempCategory);
      setFromDate(tempFromDate);
      setToDate(tempToDate);
      setCurrentPage(1);
      setShowFilterMenu(false);
      setIsFiltering(false);
    }, 450);
  };

  const handleResetFilters = () => {
    setIsFiltering(true);

    setTimeout(() => {
      setTempCategory("All");
      setTempFromDate("");
      setTempToDate("");
      setSelectedCategory("All");
      setFromDate("");
      setToDate("");
      setCurrentPage(1);
      setShowFilterMenu(false);
      setIsFiltering(false);
    }, 450);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearching(true);

    setTimeout(() => {
      setActiveSearch(searchInput.trim());
      setCurrentPage(1);
      setIsSearching(false);
    }, 500);
  };

  const handleResetSearch = () => {
    setSearchInput("");
    setActiveSearch("");
    setSelectedCategory("All");
    setFromDate("");
    setToDate("");
    setTempCategory("All");
    setTempFromDate("");
    setTempToDate("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page === currentPage || page < 1 || page > totalPages) return;

    setIsPaging(true);

    setTimeout(() => {
      setCurrentPage(page);
      setIsPaging(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 450);
  };

  if (isPageLoading) {
    return (
      <div className="student-page">
        <StudentTopbar />
        <main className="student-page-content container student-loading-area">
          <div className="student-loader-box">
            <div className="student-loader-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>Loading programs...</p>
          </div>
        </main>
        <StudentFooter />
      </div>
    );
  }

  return (
    <div className="student-page">
      {(isFiltering || isSearching || isPaging) && (
        <div className="student-global-loader">
          <div className="student-loader-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>
            {isFiltering
              ? "Filtering programs..."
              : isSearching
              ? "Searching programs..."
              : "Loading page..."}
          </p>
        </div>
      )}

      <StudentTopbar
        showSearch
        searchInput={searchInput}
        onSearchInputChange={(e) => setSearchInput(e.target.value)}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={handleResetSearch}
        onFilterClick={handleFilterClick}
        isSearching={isSearching}
      />

      <main className="student-page-content container">
        <div className="student-filter-dropdown-wrap" ref={filterRef}>
          {showFilterMenu && (
            <div className="student-filter-dropdown">
              <div className="student-filter-section">
                <p className="student-filter-title">Category</p>

                <div className="student-filter-tags">
                  {categories.map((category) => (
                    <button
                      type="button"
                      key={category}
                      className={`student-filter-tag ${
                        tempCategory === category ? "active" : ""
                      }`}
                      onClick={() => setTempCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="student-filter-section">
                <p className="student-filter-title">Date Range</p>

                <div className="student-filter-date-grid">
                  <div className="student-filter-date-group">
                    <label htmlFor="fromDate">From Date</label>
                    <input
                      id="fromDate"
                      type="date"
                      value={tempFromDate}
                      onChange={(e) => setTempFromDate(e.target.value)}
                    />
                  </div>

                  <div className="student-filter-date-group">
                    <label htmlFor="toDate">To Date</label>
                    <input
                      id="toDate"
                      type="date"
                      value={tempToDate}
                      onChange={(e) => setTempToDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="student-filter-actions">
                <button
                  type="button"
                  className="student-filter-apply"
                  onClick={handleApplyFilters}
                >
                  Apply Filters
                </button>

                <button
                  type="button"
                  className="student-filter-reset"
                  onClick={handleResetFilters}
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {pageError ? (
          <div className="student-empty-state">
            <h3>Unable to load programs</h3>
            <p>{pageError}</p>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="student-empty-state">
            <h3>No programs found</h3>
            <p>No available programs match your search or selected filters.</p>
            <button
              type="button"
              className="student-reset-search-btn"
              onClick={handleResetSearch}
            >
              Reset Search
            </button>
          </div>
        ) : (
          <>
            <div className="student-program-grid">
              {paginatedPrograms.map((program) => (
                <StudentCard
                  key={program.id}
                  program={program}
                  onOpen={setSelectedProgram}
                />
              ))}
            </div>

            <div className="student-pagination">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    type="button"
                    key={page}
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
          </>
        )}
      </main>

      <StudentFooter />

      <StudentProgramModal
        program={selectedProgram}
        onClose={() => setSelectedProgram(null)}
        onApply={handleApplyRequest}
        isApplying={isApplying}
      />

      <StudentApplyConfirmModal
        program={programToConfirm}
        onCancel={() => setProgramToConfirm(null)}
        onConfirm={handleConfirmApply}
      />
    </div>
  );
}

export default StudentHome;
