import React from "react";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalTopbar from "../../components/portal/PortalTopbar";
import PortalStatCard from "../../components/portal/PortalStatCard";
import {
  companyPrograms,
  companyParticipants,
  companyOverview,
} from "../../data/companyData";

function CompanyDashboard() {
  const activePrograms = companyPrograms.filter((item) => item.status === "Active").length;
  const completedPrograms = companyPrograms.filter((item) => item.status === "Completed").length;
  const reviewCount = companyParticipants.filter((item) => item.status === "Review").length;
  const acceptedCount = companyParticipants.filter((item) => item.status === "Accepted").length;
  const totalParticipants = companyParticipants.length;

  const dashboardStats = [
    {
      id: 1,
      title: "Active Programs",
      value: activePrograms,
      subtitle: `${completedPrograms} completed`,
      type: "programs",
    },
    {
      id: 2,
      title: "Pending Requests",
      value: reviewCount,
      subtitle: "Waiting review",
      type: "requests",
    },
    {
      id: 3,
      title: "Participants",
      value: totalParticipants,
      subtitle: `${acceptedCount} accepted`,
      type: "participants",
    },
  ];

  const snapshotRows = companyParticipants.slice(0, 4);

  const companyNavItems = [
  { key: "dashboard", label: "Dashboard", path: "/company/dashboard" },
  { key: "programs", label: "Programs", path: "/company/programs" },
  { key: "participants", label: "Participants", path: "/company/participants" },
  ];

  return (
      <PortalLayout
      activeKey="dashboard"
      navItems={companyNavItems}
      profilePath="/company/profile"
      >
      <PortalTopbar title="Dashboard" companyName="Creative Tech" />

      <div className="portal-stats-grid">
        {dashboardStats.map((item) => (
          <PortalStatCard key={item.id} item={item} />
        ))}
      </div>

      <div className="company-dashboard-grid">
        <section className="portal-panel">
          <div className="portal-panel__head">
            <h2>Application Snapshot</h2>
            <p>Latest participants and assigned programs.</p>
          </div>

          <div className="company-table-wrap">
            <table className="company-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Skills</th>
                  <th>Program</th>
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
                    <td>{item.skills}</td>
                    <td>{item.program}</td>
                    <td>
                      <span className={`company-status-badge ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="company-dashboard-side">
          <section className="portal-panel">
            <div className="portal-panel__head">
              <h2>Application Overview</h2>
            </div>

            <div className="company-overview-ring">
              <div className="company-overview-ring__circle">
                <span>{totalParticipants}</span>
              </div>
            </div>

            <div className="company-overview-list">
              {companyOverview.map((item) => (
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
              <h2>Program Status</h2>
            </div>

            <div className="company-status-summary">
              <div className="company-status-summary__item">
                <span>Active Programs</span>
                <strong>{activePrograms}</strong>
              </div>

              <div className="company-status-summary__item">
                <span>Completed Programs</span>
                <strong>{completedPrograms}</strong>
              </div>

              <div className="company-status-summary__item">
                <span>Accepted Participants</span>
                <strong>{acceptedCount}</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </PortalLayout>
  );
}

export default CompanyDashboard;