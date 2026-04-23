import React from "react";

function PortalLoader({ text = "Loading..." }) {
  return (
    <div className="portal-global-loader">
      <div className="portal-loader-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p>{text}</p>
    </div>
  );
}

export default PortalLoader;