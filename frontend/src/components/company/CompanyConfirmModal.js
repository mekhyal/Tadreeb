import React, { useEffect } from "react";

function CompanyConfirmModal({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="company-modal-overlay" onClick={onCancel}>
      <div className="company-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="company-confirm-modal__actions">
          <button type="button" className="secondary" onClick={onCancel}>
            {cancelText}
          </button>

          <button
            type="button"
            className={variant === "danger" ? "danger" : "success"}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompanyConfirmModal;