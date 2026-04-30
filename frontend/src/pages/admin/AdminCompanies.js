import React, { useEffect, useMemo, useState } from "react";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalTopbar from "../../components/portal/PortalTopbar";
import AdminCompanyDetailsModal from "../../components/admin/AdminCompanyDetailsModal";
import {
  getCompanyRequests,
  updateCompanyRequestStatus,
} from "../../api/adminAPI";

const COMPANIES_PER_PAGE = 8;

const adminNavItems = [
  { key: "dashboard", label: "Dashboard", path: "/admin/dashboard" },
  { key: "programs", label: "Programs", path: "/admin/programs" },
  { key: "participants", label: "Participants", path: "/admin/participants" },
  { key: "companies", label: "Companies", path: "/admin/companies" },
  { key: "users", label: "Users", path: "/admin/users" },
];

const companyRequestToDisplayStatus = (status) => {
  if (status === "Approved") return "Accepted";
  if (status === "Rejected") return "Rejected";
  return "Under Review";
};

const requestStatusToApiStatus = (status) => {
  if (status === "Accepted") return "Accepted";
  if (status === "Rejected") return "Rejected";
  return "Under Review";
};

const normalizeCompany = (item) => ({
  id: item._id,
  requestId: item._id?.slice(-6).toUpperCase(),
  companyName: item.companyName || "",
  companyEmail: item.officialEmail || "",
  industry: item.industry || "",
  phone: item.phoneNumber || "",
  website: item.website || "",
  companySize: item.companySize || "",
  location: item.location || "",
  foundedYear: item.foundedYear || "",
  contactPerson: item.contactPerson || "",
  companyDescription: item.companyDescription || "",
  joinReason: item.joinReason || "",
  confirmInfo: !!item.confirmInfo,
  requestDate: item.createdAt ? item.createdAt.slice(0, 10) : "",
  status: companyRequestToDisplayStatus(item.status),
});

function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCompanies = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await getCompanyRequests();
      setCompanies(res.data.map(normalizeCompany));
    } catch (err) {
      setError(err.response?.data?.message || "Could not load company requests.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

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

  const handleSaveStatus = async (companyId, status) => {
    setIsSaving(true);

    try {
      const res = await updateCompanyRequestStatus(
        companyId,
        requestStatusToApiStatus(status)
      );
      const updatedCompany = normalizeCompany(res.data.request);

      setCompanies((prev) =>
        prev.map((item) => (item.id === companyId ? updatedCompany : item))
      );

      setSelectedCompany(null);
      setToast("Company request updated successfully.");
    } catch (err) {
      setToast(err.response?.data?.message || "Could not update company status.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setToast(""), 3000);
    }
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
    <PortalLayout activeKey="companies" navItems={adminNavItems} profilePath="/admin/profile">
      <PortalTopbar title="Companies" />

      {toast && (
        <div className="portal-save-toast">
          <div className="portal-save-toast__content">{toast}</div>
          <div className="portal-save-toast__progress"></div>
        </div>
      )}

      <section className="portal-panel admin-companies-page">
        <div className="admin-companies-filters">
          {["All", "Under Review", "Accepted", "Rejected"].map((filter) => {
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

          {isLoading ? (
            <p>Loading companies...</p>
          ) : error ? (
            <p className="company-form-error">{error}</p>
          ) : (
            <>
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
                            <div className={`admin-company-avatar tone-${item.id.length % 4}`}>
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
                        <td>{item.foundedYear || "-"}</td>
                        <td>{item.requestDate}</td>
                        <td>
                          <span
                            className={`admin-company-status-text ${item.status
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
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
            </>
          )}
        </div>
      </section>

      {selectedCompany && (
        <AdminCompanyDetailsModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onSave={handleSaveStatus}
          isSaving={isSaving}
        />
      )}
    </PortalLayout>
  );
}

export default AdminCompanies;
