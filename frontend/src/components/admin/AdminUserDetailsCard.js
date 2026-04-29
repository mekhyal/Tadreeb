import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { getExternalUrl } from "../../utils/formatLinks";

function AdminUserDetailsCard({ user, onStatusChange }) {
  if (!user) {
    return (
      <div className="admin-user-details-card empty">
        <p>Select a user to view more details.</p>
      </div>
    );
  }

  const renderRoleFields = () => {
    if (user.role === "Student") {
      return (
        <div className="admin-user-details-grid">
          <div>
            <label>Student ID</label>
            <p>{user.studentId}</p>
          </div>
          <div>
            <label>University</label>
            <p>{user.universityName}</p>
          </div>
          <div>
            <label>Major</label>
            <p>{user.major}</p>
          </div>
          <div>
            <label>Year</label>
            <p>{user.year}</p>
          </div>
          <div>
            <label>Gender</label>
            <p>{user.gender}</p>
          </div>
          <div>
            <label>Country</label>
            <p>{user.country}</p>
          </div>
          <div className="admin-user-details-wide">
            <label>Skills</label>
            <p>{user.skills}</p>
          </div>
        </div>
      );
    }

    if (user.role === "Company") {
      return (
        <div className="admin-user-details-grid">
          <div>
            <label>Company ID</label>
            <p>{user.companyId}</p>
          </div>
          <div>
            <label>Industry</label>
            <p>{user.industry}</p>
          </div>
          <div>
            <label>Website</label>
            <p>
              {user.website ? (
                <a
                  href={getExternalUrl(user.website)}
                  target="_blank"
                  rel="noreferrer"
                  className="admin-external-link"
                >
                  {user.website}
                </a>
              ) : (
                "-"
              )}
            </p>
          </div>
          <div>
            <label>Company Size</label>
            <p>{user.companySize}</p>
          </div>
          <div>
            <label>Founded Year</label>
            <p>{user.foundedYear}</p>
          </div>
          <div>
            <label>Contact Person</label>
            <p>{user.contactPerson}</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="admin-user-details-grid">
          <div>
            <label>Admin ID</label>
            <p>{user.adminId}</p>
          </div>
          <div>
            <label>Job Title</label>
            <p>{user.jobTitle}</p>
          </div>
          <div>
            <label>Gender</label>
            <p>{user.gender}</p>
          </div>
          <div>
            <label>Country</label>
            <p>{user.country}</p>
          </div>
          <div className="admin-user-details-wide">
            <label>Language</label>
            <p>{user.language}</p>
          </div>
        </div>

      </>
    );
  };

  return (
    <div className="admin-user-details-card">
      <div className="admin-user-details-card__header">
        <div className="admin-user-details-avatar">
          <FaUserCircle />
        </div>

        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      </div>

      <div className="admin-user-details-grid base-grid">
        <div>
          <label>System ID</label>
          <p>{user.systemId}</p>
        </div>

        <div>
          <label>Role</label>
          <p>{user.role}</p>
        </div>

        <div>
          <label>Status</label>
          {user.role === "Admin" ? (
            <span className="admin-user-fixed-status active">Active</span>
          ) : (
            <div className="admin-user-status-select-wrap">
              <select
                className="admin-user-status-select"
                value={user.status}
                onChange={(e) => onStatusChange(user.id, e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          )}
        </div>

        <div>
          <label>Phone</label>
          <p>{user.phone}</p>
        </div>

        <div>
          <label>Location</label>
          <p>{user.location}</p>
        </div>

        <div>
          <label>Created At</label>
          <p>{user.createdAt}</p>
        </div>
      </div>

      {renderRoleFields()}
    </div>
  );
}

export default AdminUserDetailsCard;
