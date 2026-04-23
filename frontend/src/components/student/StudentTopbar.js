import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaGlobe,
  FaChevronDown,
  FaSearch,
  FaUserCircle,
  FaFilter,
} from "react-icons/fa";

function StudentTopbar({
  showSearch = false,
  searchInput = "",
  onSearchInputChange,
  onSearchSubmit,
  onFilterClick,
  isSearching = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const user = useMemo(() => {
    const stored = localStorage.getItem("tadreebUser");
    return stored ? JSON.parse(stored) : null;
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const delayedNavigate = (path) => {
    if (location.pathname === path) {
      setMenuOpen(false);
      return;
    }

    setMenuOpen(false);
    setIsNavigating(true);

    setTimeout(() => {
      navigate(path);
    }, 450);
  };

  return (
    <>
      {isNavigating && (
        <div className="student-global-loader">
          <div className="student-loader-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Loading page...</p>
        </div>
      )}

      <header className="student-topbar">
        <div className="student-topbar__inner">
          <Link to="/" className="student-brand">
            <span className="logo-dark">Tad</span>
            <span className="logo-blue">reeb</span>
          </Link>

          <div className="student-topbar__right">
            <div className="student-user-menu-wrap" ref={menuRef}>
              <button
                type="button"
                className="student-user-btn"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <div className="student-avatar">
                  <FaUserCircle />
                </div>

                <span className="student-user-name">
                  {user?.name || "Abdulaziz"}
                </span>

                <FaChevronDown className="student-user-arrow" />
              </button>

              {menuOpen && (
                <div className="student-user-dropdown">
                  <button
                    type="button"
                    className={location.pathname === "/student" ? "active" : ""}
                    onClick={() => delayedNavigate("/student")}
                  >
                    Home
                  </button>

                  <button
                    type="button"
                    className={
                      location.pathname === "/student/profile" ? "active" : ""
                    }
                    onClick={() => delayedNavigate("/student/profile")}
                  >
                    Profile
                  </button>

                  <button
                    type="button"
                    className={
                      location.pathname === "/student/applications"
                        ? "active"
                        : ""
                    }
                    onClick={() => delayedNavigate("/student/applications")}
                  >
                    Applications
                  </button>
                </div>
              )}
            </div>

            <button type="button" className="student-lang-btn">
              <FaGlobe />
            </button>
          </div>
        </div>
      </header>

      {showSearch && (
        <div className="student-toolbar container">
          <form className="student-search-box" onSubmit={onSearchSubmit}>
            <FaSearch />
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={onSearchInputChange}
            />

            <button
              type="submit"
              className="student-search-submit"
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>

          <button
            type="button"
            className="student-filter-btn"
            onClick={onFilterClick}
          >
            <FaFilter />
            <span>Filter</span>
          </button>
        </div>
      )}
    </>
  );
}

export default StudentTopbar;