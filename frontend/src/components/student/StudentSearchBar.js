import React from "react";
import { FaSearch } from "react-icons/fa";

function StudentSearchBar({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  isSearching,
}) {
  return (
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
  );
}

export default StudentSearchBar;