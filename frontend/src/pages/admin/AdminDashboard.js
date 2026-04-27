import React, { useEffect, useMemo, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalTopbar from "../../components/portal/PortalTopbar";
import PortalStatCard from "../../components/portal/PortalStatCard";
import {
  getStudents,
  getCompanies,
  getAdmins,
  getAdminApplications,
} from "../../api/adminAPI";
import { getOpportunities } from "../../api/opportunityAPI";

const adminNavItems = [
  { key: "dashboard", label: "Dashboard", path: "/admin/dashboard" },
  { key: "programs", label: "Programs", path: "/admin/programs" },
  { key: "participants", label: "Participants", path: "/admin/participants" },
  { key: "companies", label: "Companies", path: "/admin/companies" },
  { key: "users", label: "Users", path: "/admin/users" },
];

const toneFromId = (id) => {
  const s = String(id || "");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i)) % 4;
  return h;
};

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    programs: 0,
    students: 0,
    acceptedApps: 0,
  });
  const [snapshotRows, setSnapshotRows] = useState([]);
  const [overview, setOverview] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [totalApplications, setTotalApplications] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [st, co, ad, appsRes, oppsRes] = await Promise.all([
          getStudents(),
          getCompanies(),
          getAdmins(),
          getAdminApplications(),
          getOpportunities(),
        ]);

        if (cancelled) return;

        const students = Array.isArray(st.data) ? st.data : [];
        const companies = Array.isArray(co.data) ? co.data : [];
        const admins = Array.isArray(ad.data) ? ad.data : [];
        const applications = Array.isArray(appsRes.data) ? appsRes.data : [];
        const opportunities = Array.isArray(oppsRes.data) ? oppsRes.data : [];

        const acceptedApps = applications.filter(
          (a) => a.status === "Accepted"
        ).length;

        setStats({
          programs: opportunities.length,
          students: students.length,
          acceptedApps,
        });
        setTotalApplications(applications.length);

        const snap = applications.slice(0, 4).map((raw) => {
          const s = raw.studentID || {};
          const p = raw.programID || {};
          const c = p.companyID || {};
          return {
            id: String(raw._id),
            name:
              [s.firstName, s.lastName].filter(Boolean).join(" ").trim() ||
              "Student",
            email: s.email || "",
            studentId: s.universityID || "",
            program: p.title || "—",
            company:
              typeof c === "object" && c
                ? c.companyName || c.email || "—"
                : "—",
            status: raw.status || "—",
          };
        });
        setSnapshotRows(snap);

        const total = applications.length || 1;
        const pct = (n) => Math.round((n / total) * 100);
        const reviewCount = applications.filter(
          (a) => a.status === "Under Review" || a.status === "Submitted"
        ).length;
        const acceptedCount = applications.filter(
          (a) => a.status === "Accepted"
        ).length;
        const rejectedCount = applications.filter(
          (a) => a.status === "Rejected"
        ).length;

        setOverview([
          { label: "Review", value: pct(reviewCount), type: "review" },
          { label: "Accepted", value: pct(acceptedCount), type: "accepted" },
          { label: "Rejected", value: pct(rejectedCount), type: "rejected" },
        ]);

        const combined = [
          ...students.map((u) => ({
            id: String(u._id),
            name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
            country: u.universityName || "—",
            createdAt: u.createdAt,
          })),
          ...companies.map((u) => ({
            id: String(u._id),
            name: u.companyName || u.email || "Company",
            country: u.location || "—",
            createdAt: u.createdAt,
          })),
          ...admins.map((u) => ({
            id: String(u._id),
            name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
            country: u.country || "—",
            createdAt: u.createdAt,
          })),
        ];

        combined.sort(
          (a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setRecentUsers(combined.slice(0, 4));
      } catch (e) {
        if (!cancelled) {
          setError(
            e.response?.data?.message || "Could not load dashboard data."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const adminStats = useMemo(
    () => [
      {
        id: 1,
        title: "Programs",
        value: stats.programs,
        subtitle: "Published opportunities",
        type: "programs",
      },
      {
        id: 2,
        title: "Students",
        value: stats.students,
        subtitle: "Registered accounts",
        type: "requests",
      },
      {
        id: 3,
        title: "Accepted",
        value: stats.acceptedApps,
        subtitle: "Accepted applications",
        type: "participants",
      },
    ],
    [stats]
  );

  return (
    <PortalLayout
      activeKey="dashboard"
      navItems={adminNavItems}
      profilePath="/admin/profile"
    >
      <PortalTopbar title="Dashboard" />

      {error && (
        <p className="company-form-error" style={{ marginBottom: "1rem" }}>
          {error}
        </p>
      )}

      <div className="portal-stats-grid">
        {adminStats.map((item, index) => (
          <PortalStatCard key={item.id} item={item} index={index} />
        ))}
      </div>

      <div className="admin-dashboard-grid">
        <section className="portal-panel">
          <div className="portal-panel__head">
            <h2>Recent Applications</h2>
          </div>

          <div className="company-table-wrap">
            {loading ? (
              <p>Loading…</p>
            ) : snapshotRows.length === 0 ? (
              <p>No applications yet.</p>
            ) : (
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
                          <div
                            className={`company-person-avatar tone-${toneFromId(
                              item.id
                            )}`}
                          ></div>
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
                        <span
                          className={`admin-status-text ${String(
                            item.status
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <aside className="admin-dashboard-side">
          <section className="portal-panel">
            <div className="portal-panel__head">
              <h2>Application Overview</h2>
            </div>

            <div className="company-overview-ring">
              <div className="company-overview-ring__circle">
                <span>{totalApplications}</span>
              </div>
            </div>

            <div className="company-overview-list">
              {overview.map((item) => (
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
              {recentUsers.length === 0 && !loading ? (
                <p>No users yet.</p>
              ) : (
                recentUsers.map((item) => (
                  <div key={item.id} className="admin-recent-user">
                    <div className="admin-recent-user__left">
                      <div
                        className={`company-person-avatar tone-${toneFromId(
                          item.id
                        )}`}
                      ></div>

                      <div>
                        <strong>{item.name}</strong>
                        <p>{item.country}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="admin-recent-user__mail"
                      aria-label="Mail"
                    >
                      <FaEnvelope />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </aside>
      </div>
    </PortalLayout>
  );
}

export default AdminDashboard;
