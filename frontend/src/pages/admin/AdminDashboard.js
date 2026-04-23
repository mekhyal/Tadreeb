import React from "react";
import { FaEnvelope } from "react-icons/fa";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalTopbar from "../../components/portal/PortalTopbar";
import PortalStatCard from "../../components/portal/PortalStatCard";
import {
  adminStats,
  adminOverview,
  adminParticipants,
  adminRecentUsers,
} from "../../data/adminData";

const adminNavItems = [
  { key: "dashboard", label: "Dashboard", path: "/admin/dashboard" },
  { key: "programs", label: "Programs", path: "/admin/programs" },
  { key: "participants", label: "Participants", path: "/admin/participants" },
  { key: "companies", label: "Companies", path: "/admin/companies" },
  { key: "users", label: "Users", path: "/admin/users" },
];

function AdminDashboard() {
  const snapshotRows = adminParticipants.slice(0, 4);

  return (
    <PortalLayout
      activeKey="dashboard"
      navItems={adminNavItems}
      profilePath="/admin/profile"
    >
      <PortalTopbar title="Dashboard" companyName="Abdulaziz" />

      <div className="portal-stats-grid">
        {adminStats.map((item) => (
          <PortalStatCard key={item.id} item={item} />
        ))}
      </div>

      <div className="admin-dashboard-grid">
        <section className="portal-panel">
          <div className="portal-panel__head">
            <h2>Students</h2>
          </div>

          <div className="company-table-wrap">
            <table className="company-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Program</th>
                  <th>Company</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {snapshotRows.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="company-person-cell">
                        <div className={`company-person-avatar tone-${item.id % 4}`}></div>
                        <div>
                          <strong>{item.name}</strong>
                          <span>{item.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{item.studentId}</td>
                    <td>{item.program}</td>
                    <td>{item.company}</td>
                    <td>
                      <span className={`admin-status-text ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="admin-dashboard-side">
          <section className="portal-panel">
            <div className="portal-panel__head">
              <h2>Application Overview</h2>
            </div>

            <div className="company-overview-ring">
              <div className="company-overview-ring__circle">
                <span>18K</span>
              </div>
            </div>

            <div className="company-overview-list">
              {adminOverview.map((item) => (
                <div key={item.label} className="company-overview-item">
                  <div className="company-overview-item__left">
                    <span className={`dot ${item.type}`}></span>
                    <span>{item.label}</span>
                  </div>
                  <strong>{item.value}%</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="portal-panel">
            <div className="portal-panel__head">
              <h2>Recent Users</h2>
            </div>

            <div className="admin-recent-users">
              {adminRecentUsers.map((item) => (
                <div key={item.id} className="admin-recent-user">
                  <div className="admin-recent-user__left">
                    <div className={`company-person-avatar tone-${item.id % 4}`}></div>

                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.country}</p>
                    </div>
                  </div>

                  <button type="button" className="admin-recent-user__mail">
                    <FaEnvelope />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </PortalLayout>
  );
}

export default AdminDashboard;