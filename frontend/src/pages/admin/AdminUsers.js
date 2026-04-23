import React, { useMemo, useState } from "react";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalTopbar from "../../components/portal/PortalTopbar";
import PortalStatCard from "../../components/portal/PortalStatCard";
import AdminUserModal from "../../components/admin/AdminUserModal";
import AdminUserDetailsCard from "../../components/admin/AdminUserDetailsCard";
import {
  adminUsers as initialUsers,
  adminUserStats,
} from "../../data/adminData";

const USERS_PER_PAGE = 6;

const adminNavItems = [
  { key: "dashboard", label: "Dashboard", path: "/admin/dashboard" },
  { key: "programs", label: "Programs", path: "/admin/programs" },
  { key: "participants", label: "Participants", path: "/admin/participants" },
  { key: "companies", label: "Companies", path: "/admin/companies" },
  { key: "users", label: "Users", path: "/admin/users" },
];

function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(initialUsers[0] || null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [toast, setToast] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(() => {
    if (activeFilter === "All") return users;
    return users.filter((item) => item.role === activeFilter);
  }, [users, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(start, start + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const computedStats = useMemo(() => {
    const allCount = users.length;
    const studentsCount = users.filter((item) => item.role === "Student").length;
    const companiesCount = users.filter((item) => item.role === "Company").length;
    const adminsCount = users.filter((item) => item.role === "Admin").length;

    return adminUserStats.map((item) => {
      if (item.title === "All Users") return { ...item, value: allCount };
      if (item.title === "Students") return { ...item, value: studentsCount };
      if (item.title === "Companies") return { ...item, value: companiesCount };
      if (item.title === "Admins") return { ...item, value: adminsCount };
      return item;
    });
  }, [users]);

  const handleAddUser = (newUser) => {
    setUsers((prev) => [newUser, ...prev]);
    setSelectedUser(newUser);
    setShowAddUserModal(false);
    setCurrentPage(1);
    setToast("User added successfully.");
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

  const handleStatusChange = (userId, newStatus) => {
    setUsers((prev) =>
      prev.map((item) => (item.id === userId ? { ...item, status: newStatus } : item))
    );

    setSelectedUser((prev) =>
      prev && prev.id === userId ? { ...prev, status: newStatus } : prev
    );

    setToast("User status updated successfully.");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <PortalLayout
      activeKey="users"
      navItems={adminNavItems}
      profilePath="/admin/profile"
    >
      <PortalTopbar title="Users" companyName="Abdulaziz" />

      {toast && (
        <div className="portal-save-toast">
          <div className="portal-save-toast__content">{toast}</div>
          <div className="portal-save-toast__progress"></div>
        </div>
      )}

      <section className="portal-panel admin-users-page">
        <div className="admin-users-stats">
          {computedStats.map((item) => (
            <PortalStatCard key={item.id} item={item} />
          ))}
        </div>

        <div className="admin-users-toolbar">
          <div className="admin-users-filters">
            {["All", "Student", "Company", "Admin"].map((filter) => {
              const count =
                filter === "All"
                  ? users.length
                  : users.filter((item) => item.role === filter).length;

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

          <button
            type="button"
            className="admin-users-add-btn"
            onClick={() => setShowAddUserModal(true)}
          >
            Add User
          </button>
        </div>

        <div className="admin-users-grid">
          <div className="portal-panel admin-users-table-panel">
            <div className="portal-panel__head">
              <h2>System Users</h2>
            </div>

            <div className="company-table-wrap">
              <table className="company-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>System ID</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Email</th>
                    <th>Location</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedUsers.map((item) => (
                    <tr
                      key={item.id}
                      className={`clickable-row ${
                        selectedUser?.id === item.id ? "selected-row" : ""
                      }`}
                      onClick={() => setSelectedUser(item)}
                    >
                      <td>
                        <div className="admin-company-cell">
                          <div className={`admin-company-avatar tone-${item.id % 4}`}>
                            {item.name.charAt(0)}
                          </div>

                          <div>
                            <strong>{item.name}</strong>
                            <span>{item.createdAt}</span>
                          </div>
                        </div>
                      </td>
                      <td>{item.systemId}</td>
                      <td>{item.role}</td>
                      <td>
                        <span className={`admin-user-status ${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.email}</td>
                      <td>{item.location}</td>
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

          <AdminUserDetailsCard
            user={selectedUser}
            onStatusChange={handleStatusChange}
          />
        </div>
      </section>

      {showAddUserModal && (
        <AdminUserModal
          existingUsers={users}
          onClose={() => setShowAddUserModal(false)}
          onSave={handleAddUser}
        />
      )}
    </PortalLayout>
  );
}

export default AdminUsers;