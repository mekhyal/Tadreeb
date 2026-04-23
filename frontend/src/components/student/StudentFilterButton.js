import React from "react";
import { FaFilter } from "react-icons/fa";

function StudentFilterButton({ onClick }) {
  return (
    <button type="button" className="student-filter-btn" onClick={onClick}>
      <FaFilter />
      <span>Filter</span>
    </button>
  );
}

export default StudentFilterButton;