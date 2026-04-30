import React, { useEffect, useRef, useState } from "react";
import { FaEllipsisV, FaUsers, FaCalendarAlt } from "react-icons/fa";
import { programStatusClass } from "../../utils/programStatus";

function CompanyProgramCard({
  program,
  onEdit,
  onRemove,
  footerContent,
}) {
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
          <img src={program.displayImage || program.image} alt={program.title} />

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
        <div className="company-program-card__meta-row">
          <FaUsers />
          <span>
            {program.applicantsCount != null ? (
              <>
                <strong>{program.applicantsCount}</strong> applicant(s),{" "}
                <strong>{program.usedSeats}</strong> accepted of{" "}
                <strong>{program.seats}</strong> seats
              </>
            ) : (
              <>
                <strong>{program.usedSeats}</strong> accepted of{" "}
                <strong>{program.seats}</strong> seats
              </>
            )}
          </span>
        </div>

        <div className="company-program-card__meta-row company-program-card__meta-row--stacked">
          <FaCalendarAlt />
          <span>
            Register closes
            <strong>{program.registrationDeadline || "Not set"}</strong>
          </span>
        </div>
      </div>

      <div className="company-program-card__seats">
        Open seats (after acceptances): <strong>{program.availableSeats}</strong>
      </div>

      <span className={`company-program-status ${programStatusClass(program.status)}`}>
        {program.status}
      </span>

      {footerContent && (
        <div className="company-program-card__footer">{footerContent}</div>
      )}
    </div>
  );
}

export default CompanyProgramCard;
