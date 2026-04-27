import React, { useEffect, useMemo, useState } from "react";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalTopbar from "../../components/portal/PortalTopbar";
import PortalStatCard from "../../components/portal/PortalStatCard";
import { useAuth } from "../../context/AuthContext";
import { getOpportunities } from "../../api/opportunityAPI";
import { getCompanyApplications } from "../../api/applicationAPI";

const toneFromId = (id) => {
  const s = String(id || "");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i)) % 4;
  return h;
};

function CompanyDashboard() {
  const { user } = useAuth();
  const companyId = user?.id && String(user.id);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [programs, setPrograms] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!companyId) return undefined;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [oppsRes, appsRes] = await Promise.all([
          getOpportunities(),
          getCompanyApplications(),
        ]);
        if (cancelled) return;

        const allOpps = Array.isArray(oppsRes.data) ? oppsRes.data : [];
        const mine = allOpps.filter((p) => {
          const owner = p.companyID?._id || p.companyID;
          return owner && String(owner) === companyId;
        });

        const mappedPrograms = mine.map((item) => {
          const seats = Number(item.seats) || 0;
          const usedSeats = Number(item.usedSeats) || 0;
          const availableSeats =
            item.availableSeats !== undefined
              ? Number(item.availableSeats)
              : Math.max(seats - usedSeats, 0);
          return {
            id: String(item._id),
            status:
              item.status === "Completed" || availableSeats <= 0
                ? "Completed"
                : "Active",
          };
        });

        setPrograms(mappedPrograms);
        setApplications(Array.isArray(appsRes.data) ? appsRes.data : []);
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
  }, [companyId]);

  const activePrograms = programs.filter((p) => p.status === "Active").length;
  const completedPrograms = programs.filter(
    (p) => p.status === "Completed"
  ).length;

  const reviewCount = applications.filter(
    (a) => a.status === "Submitted" || a.status === "Under Review"
  ).length;
  const acceptedCount = applications.filter(
    (a) => a.status === "Accepted"
  ).length;
  const rejectedCount = applications.filter(
    (a) => a.status === "Rejected"
  ).length;
  const totalParticipants = applications.length;

  const dashboardStats = useMemo(
    () => [
      {
        id: 1,
        title: "Active Programs",
        value: activePrograms,
        subtitle: `${completedPrograms} completed`,
        type: "programs",
      },
      {
        id: 2,
        title: "Pending review",
        value: reviewCount,
        subtitle: "Applications in queue",
        type: "requests",
      },
      {
        id: 3,
        title: "Participants",
        value: totalParticipants,
        subtitle: `${acceptedCount} accepted`,
        type: "participants",
      },
    ],
    [
      activePrograms,
      completedPrograms,
      reviewCount,
      acceptedCount,
      totalParticipants,
    ]
  );

  const snapshotRows = useMemo(() => {
    return applications.slice(0, 4).map((raw) => {
      const s = raw.studentID || {};
      const p = raw.programID || {};
      const skills = Array.isArray(s.skills)
        ? s.skills.join(", ")
        : s.skills || "—";
      return {
        id: String(raw._id),
        name:
          [s.firstName, s.lastName].filter(Boolean).join(" ").trim() ||
          "Student",
        email: s.email || "",
        studentId: s.universityID || "",
        skills,
        program: p.title || "—",
        status: raw.status || "—",
      };
    });
  }, [applications]);

  const total = applications.length || 1;
  const pct = (n) => Math.round((n / total) * 100);
  const companyOverview = [
    {
      label: "Review",
      value: pct(
        applications.filter(
          (a) =>
            a.status === "Submitted" || a.status === "Under Review"
        ).length
      ),
      type: "review",
    },
    {
      label: "Accepted",
      value: pct(acceptedCount),
      type: "accepted",
    },
    {
      label: "Rejected",
      value: pct(rejectedCount),
      type: "rejected",
    },
  ];

  const companyNavItems = [
    { key: "dashboard", label: "Dashboard", path: "/company/dashboard" },
    { key: "programs", label: "Programs", path: "/company/programs" },
    {
      key: "participants",
      label: "Participants",
      path: "/company/participants",
    },
  ];

  return (
    <PortalLayout
      activeKey="dashboard"
      navItems={companyNavItems}
      profilePath="/company/profile"
    >
      <PortalTopbar title="Dashboard" />

      {error && (
        <p className="company-form-error" style={{ marginBottom: "1rem" }}>
          {error}
        </p>
      )}

      <div className="portal-stats-grid">
        {dashboardStats.map((item, index) => (
          <PortalStatCard key={item.id} item={item} index={index} />
        ))}
      </div>

      <div className="company-dashboard-grid">
        <section className="portal-panel">
          <div className="portal-panel__head">
            <h2>Application Snapshot</h2>
            <p>Latest participants and assigned programs.</p>
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
                      <td>{item.skills}</td>
                      <td>{item.program}</td>
                      <td>
                        <span
                          className={`company-status-badge ${String(
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
