import React, { useEffect, useMemo, useRef, useState } from "react";
import StudentTopbar from "../components/student/StudentTopbar";
import StudentFooter from "../components/student/StudentFooter";
import StudentCard from "../components/student/StudentCard";
import StudentProgramModal from "../components/student/StudentProgramModal";
import { studentPrograms as initialPrograms } from "../data/studentData";

const PROGRAMS_PER_PAGE = 6;

function StudentHome() {
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [programs, setPrograms] = useState(initialPrograms);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isPaging, setIsPaging] = useState(false);

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
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 450);

    return () => clearTimeout(timer);
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

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesSearch = program.title
        .toLowerCase()
        .includes(activeSearch.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || program.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [programs, activeSearch, selectedCategory]);

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

  const datesOverlap = (aStart, aEnd, bStart, bEnd) => {
    const startA = new Date(aStart);
    const endA = new Date(aEnd);
    const startB = new Date(bStart);
    const endB = new Date(bEnd);

    return startA <= endB && startB <= endA;
  };

  const handleApply = (programId) => {
    const targetProgram = programs.find((program) => program.id === programId);
    if (!targetProgram) return;

    if (targetProgram.status === "Complete") {
      setSelectedProgram({
        ...targetProgram,
        actionMessage:
          "This program is already full and no longer accepts applications.",
        actionType: "error",
      });
      return;
    }

    const conflictingProgram = programs.find(
      (program) =>
        program.applied &&
        program.id !== targetProgram.id &&
        datesOverlap(
          targetProgram.startDate,
          targetProgram.endDate,
          program.startDate,
          program.endDate
        )
    );

    if (conflictingProgram) {
      setSelectedProgram({
        ...targetProgram,
        actionMessage: `You cannot apply because you already joined "${conflictingProgram.title}" during an overlapping period.`,
        actionType: "error",
      });
      return;
    }

    const updated = programs.map((program) =>
      program.id === programId
        ? {
            ...program,
            applied: true,
            actionMessage: "Your application was submitted successfully.",
            actionType: "success",
          }
        : program
    );

    setPrograms(updated);

    const appliedProgram = updated.find((program) => program.id === programId);
    setSelectedProgram(appliedProgram);
  };

  const handleFilterClick = () => {
    setShowFilterMenu((prev) => !prev);
  };

  const handleCategorySelect = (category) => {
    setIsFiltering(true);

    setTimeout(() => {
      setSelectedCategory(category);
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
        onFilterClick={handleFilterClick}
        isSearching={isSearching}
      />

      <main className="student-page-content container">
        <div className="student-filter-dropdown-wrap" ref={filterRef}>
          {showFilterMenu && (
            <div className="student-filter-dropdown">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={`student-filter-tag ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {filteredPrograms.length === 0 ? (
          <div className="student-empty-state">
            <h3>No programs found</h3>
            <p>
              No available programs match your search or selected category.
            </p>
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
        onApply={handleApply}
      />
    </div>
  );
}

export default StudentHome;