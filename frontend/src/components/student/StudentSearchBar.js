import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

function StudentSearchBar({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  onClearSearch,
  isSearching,
}) {
  const hasSearchValue = Boolean(searchInput.trim());

  return (
    <form className="student-search-box" onSubmit={onSearchSubmit}>
      <FaSearch />
      <input
        type="text"
        placeholder="Search..."
        value={searchInput}
        onChange={onSearchInputChange}
      />

      {hasSearchValue && (
        <button
          type="button"
          className="student-search-clear"
          onClick={onClearSearch}
          aria-label="Clear search"
        >
          <FaTimes />
        </button>
      )}

      <button
        type="submit"
        className="student-search-submit"
        disabled={isSearching}
      >
        {isSearching ? "Searching..." : "Search"}
      </button>
    </form>
  );
}

export default StudentSearchBar;
