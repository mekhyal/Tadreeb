import React from "react";
import StudentHeader from "./StudentHeader";
import StudentSearchBar from "./StudentSearchBar";
import StudentFilterButton from "./StudentFilterButton";

function StudentTopbar({
  showSearch = false,
  searchInput = "",
  onSearchInputChange,
  onSearchSubmit,
  onFilterClick,
  isSearching = false,
}) {
  return (
    <>
      <StudentHeader />

      {showSearch && (
        <div className="student-toolbar container">
          <StudentSearchBar
            searchInput={searchInput}
            onSearchInputChange={onSearchInputChange}
            onSearchSubmit={onSearchSubmit}
            isSearching={isSearching}
          />

          <StudentFilterButton onClick={onFilterClick} />
        </div>
      )}
    </>
  );
}

export default StudentTopbar;