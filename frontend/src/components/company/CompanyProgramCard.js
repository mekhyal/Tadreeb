import React, { useEffect, useRef, useState } from "react";
import { FaEllipsisV, FaUsers, FaCalendarAlt } from "react-icons/fa";

function CompanyProgramCard({ program, onEdit, onComplete, onRemove }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="company-program-card">
      <div className="company-program-card__top">
        <div className="company-program-card__header">
          <img src={program.image} alt={program.title} />

          <div>
            <h3>{program.title}</h3>
            <p>{program.subtitle}</p>
          </div>
        </div>

        <div className="company-program-card__menu" ref={menuRef}>
          <button type="button" onClick={() => setShowMenu((prev) => !prev)}>
            <FaEllipsisV />
          </button>

          {showMenu && (
            <div className="company-program-card__dropdown">
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onComplete(program);
                }}
              >
                Mark as Completed
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onEdit(program);
                }}
              >
                Edit
              </button>

              <button
                type="button"
                className="danger"
                onClick={() => {
                  setShowMenu(false);
                  onRemove(program);
                }}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="company-program-card__description">{program.description}</p>

      <div className="company-program-card__meta">
        <div>
          <FaUsers />
          <span>{program.participants} Participants</span>
        </div>

        <div>
          <FaCalendarAlt />
          <span>{program.dateTo}</span>
        </div>
      </div>

      <span className={`company-program-status ${program.status.toLowerCase()}`}>
        {program.status}
      </span>
    </div>
  );
}

export default CompanyProgramCard;