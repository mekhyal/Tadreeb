import React, { useMemo, useState } from "react";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalTopbar from "../../components/portal/PortalTopbar";
import PortalStatCard from "../../components/portal/PortalStatCard";
import AdminCompanyDetailsModal from "../../components/admin/AdminCompanyDetailsModal";
import { adminCompanies as initialCompanies } from "../../data/adminData";

const COMPANIES_PER_PAGE = 8;

const adminNavItems = [
  { key: "dashboard", label: "Dashboard", path: "/admin/dashboard" },
  { key: "programs", label: "Programs", path: "/admin/programs" },
  { key: "participants", label: "Participants", path: "/admin/participants" },
  { key: "companies", label: "Companies", path: "/admin/companies" },
  { key: "users", label: "Users", path: "/admin/users" },
];

function AdminCompanies() {
  const [companies, setCompanies] = useState(initialCompanies);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [toast, setToast] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const stats = useMemo(() => {
    const total = companies.length;
    const pending = companies.filter((item) => item.status === "Pending").length;
    const review = companies.filter((item) => item.status === "Review").length;
    const accepted = companies.filter((item) => item.status === "Accepted").length;
    const rejected = companies.filter((item) => item.status === "Rejected").length;

    return [
      { id: 1, title: "Total Companies", value: total, subtitle: "All requests", type: "programs" },
      { id: 2, title: "Pending", value: pending, subtitle: "Waiting action", type: "requests" },
      { id: 3, title: "In Review", value: review, subtitle: "Under review", type: "participants" },
      { id: 4, title: "Accepted", value: accepted, subtitle: "Approved", type: "programs" },
      { id: 5, title: "Rejected", value: rejected, subtitle: "Declined", type: "participants" },
    ];
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    if (activeFilter === "All") return companies;
    return companies.filter((item) => item.status === activeFilter);
  }, [companies, activeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCompanies.length / COMPANIES_PER_PAGE)
  );

  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * COMPANIES_PER_PAGE;
    return filteredCompanies.slice(start, start + COMPANIES_PER_PAGE);
  }, [filteredCompanies, currentPage]);

  const handleSaveStatus = (companyId, status) => {
    setCompanies((prev) =>
      prev.map((item) => (item.id === companyId ? { ...item, status } : item))
    );
    setSelectedCompany(null);
    setToast("Company request updated successfully.");
    setTimeout(() => setToast(""), 3000);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PortalLayout
      activeKey="companies"
      navItems={adminNavItems}
      profilePath="/admin/profile"
    >
      <PortalTopbar title="Companies" companyName="Abdulaziz" />

      {toast && (
        <div className="portal-save-toast">
          <div className="portal-save-toast__content">{toast}</div>
          <div className="portal-save-toast__progress"></div>
        </div>
      )}

      <section className="portal-panel admin-companies-page">
        <div className="admin-companies-stats">
          {stats.map((item) => (
            <PortalStatCard key={item.id} item={item} />
          ))}
        </div>

        <div className="admin-companies-filters">
          {["All", "Pending", "Review", "Accepted", "Rejected"].map((filter) => {
            const count =
              filter === "All"
                ? companies.length
                : companies.filter((item) => item.status === filter).length;

            return (
              <button
                key={filter}
                type="button"
                className={activeFilter === filter ? "active" : ""}
                onClick={() => handleFilterChange(filter)}
              >
                {filter} ({count})
              </button>
            );
          })}
        </div>

        <div className="portal-panel admin-companies-table-panel">
          <div className="portal-panel__head">
            <h2>Companies Requests</h2>
          </div>

          <div className="company-table-wrap">
            <table className="company-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Request ID</th>
                  <th>Industry</th>
                  <th>Founded</th>
                  <th>Request Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedCompanies.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="admin-company-cell">
                        <div className={`admin-company-avatar tone-${item.id % 4}`}>
                          {item.companyName.charAt(0)}
                        </div>

                        <div>
                          <strong>{item.companyName}</strong>
                          <span>{item.companyEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td>{item.requestId}</td>
                    <td>{item.industry}</td>
                    <td>{item.foundedYear}</td>
                    <td>{item.requestDate}</td>
                    <td>
                      <span className={`admin-company-status-text ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-company-view-btn"
                        onClick={() => setSelectedCompany(item)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="admin-pagination">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={currentPage === page ? "active" : ""}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {selectedCompany && (
        <AdminCompanyDetailsModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onSave={handleSaveStatus}
        />
      )}
    </PortalLayout>
  );
}

export default AdminCompanies;