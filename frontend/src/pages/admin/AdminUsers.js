import React, { useEffect, useMemo, useState } from "react";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalTopbar from "../../components/portal/PortalTopbar";
import PortalStatCard from "../../components/portal/PortalStatCard";
import AdminUserModal from "../../components/admin/AdminUserModal";
import AdminUserDetailsCard from "../../components/admin/AdminUserDetailsCard";
import {
  getStudents,
  getCompanies,
  getAdmins,
  createStudent,
  createCompany,
  createAdmin,
  updateCompanyStatus,
  updateStudentStatus,
  updateAdminStatus,
} from "../../api/adminAPI";

const USERS_PER_PAGE = 6;

const adminNavItems = [
  { key: "dashboard", label: "Dashboard", path: "/admin/dashboard" },
  { key: "programs", label: "Programs", path: "/admin/programs" },
  { key: "participants", label: "Participants", path: "/admin/participants" },
  { key: "companies", label: "Companies", path: "/admin/companies" },
  { key: "users", label: "Users", path: "/admin/users" },
];

const splitName = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || parts[0] || "",
  };
};

const studentStatusLabel = (s) => {
  if (s === "active") return "Active";
  if (s === "inactive") return "Inactive";
  if (s === "pending") return "Pending";
  return s ? String(s).charAt(0).toUpperCase() + String(s).slice(1) : "Active";
};

const normalizeStudent = (item) => ({
  id: item._id,
  systemId: item.universityID || item._id?.slice(-6).toUpperCase(),
  name: `${item.firstName || ""} ${item.lastName || ""}`.trim(),
  email: item.email || "",
  role: "Student",
  status: studentStatusLabel(item.status),
  phone: item.mobileNo || "",
  location: item.country || "Kuwait",
  createdAt: item.createdAt ? item.createdAt.slice(0, 10) : "",
  studentId: item.universityID || "",
  universityName: item.universityName || "",
  major: item.major || "",
  year: item.year || "",
  gender: item.gender || "",
  country: item.country || "Kuwait",
  skills: Array.isArray(item.skills) ? item.skills.join(", ") : item.skills || "",
});

const normalizeCompany = (item) => ({
  id: item._id,
  systemId: item._id?.slice(-6).toUpperCase(),
  name: item.companyName || "",
  email: item.email || "",
  role: "Company",
  status: item.status || "Pending",
  phone: item.phone || "",
  location: item.location || "",
  createdAt: item.createdAt ? item.createdAt.slice(0, 10) : "",
  companyId: item._id?.slice(-6).toUpperCase(),
  industry: item.industry || "",
  website: item.website || "",
  companySize: item.size || "",
  foundedYear: item.foundedYear || "",
  contactPerson: item.contactPerson || "",
  internshipAvailability: item.status || "Pending",
});

const normalizeAdmin = (item) => ({
  id: item._id,
  systemId: item._id?.slice(-6).toUpperCase(),
  name: `${item.firstName || ""} ${item.lastName || ""}`.trim(),
  email: item.email || "",
  role: "Admin",
  status: item.status || "Active",
  phone: item.phone || "",
  location: item.country || "Kuwait",
  createdAt: item.createdAt ? item.createdAt.slice(0, 10) : "",
  adminId: item._id?.slice(-6).toUpperCase(),
  jobTitle: item.jobTitle || "",
  gender: item.gender || "",
  country: item.country || "",
  language: item.language || "",
  extraInfo: item.extraInfo || "",
});

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");

    try {
      const [studentsRes, companiesRes, adminsRes] = await Promise.all([
        getStudents(),
        getCompanies(),
        getAdmins(),
      ]);

      const normalizedUsers = [
        ...studentsRes.data.map(normalizeStudent),
        ...companiesRes.data.map(normalizeCompany),
        ...adminsRes.data.map(normalizeAdmin),
      ];

      setUsers(normalizedUsers);
      setSelectedUser(normalizedUsers[0] || null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load users.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
    return [
      {
        id: 1,
        title: "All Users",
        value: users.length,
        subtitle: "System accounts",
      },
      {
        id: 2,
        title: "Students",
        value: users.filter((item) => item.role === "Student").length,
        subtitle: "Registered students",
      },
      {
        id: 3,
        title: "Companies",
        value: users.filter((item) => item.role === "Company").length,
        subtitle: "Company accounts",
      },
      {
        id: 4,
        title: "Admins",
        value: users.filter((item) => item.role === "Admin").length,
        subtitle: "System admins",
      },
    ];
  }, [users]);

  const buildStudentPayload = (newUser) => {
    const { firstName, lastName } = splitName(newUser.name);

    return {
      universityID: newUser.studentId,
      firstName,
      lastName,
      email: newUser.email,
      password: newUser.password,
      mobileNo: newUser.phone,
      gender: newUser.gender,
      universityName: newUser.universityName,
      major: newUser.major,
      year: newUser.year,
      skills: newUser.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };
  };

  const buildCompanyPayload = (newUser) => {
    return {
      companyName: newUser.name,
      email: newUser.email,
      password: newUser.password,
      industry: newUser.industry,
      phone: newUser.phone,
      website: newUser.website,
      size: newUser.companySize,
      location: newUser.location,
      foundedYear: newUser.foundedYear,
      contactPerson: newUser.contactPerson,
      status: newUser.status === "Inactive" ? "Pending" : newUser.status,
    };
  };

  const buildAdminPayload = (newUser) => {
    const { firstName, lastName } = splitName(newUser.name);

    return {
      firstName,
      lastName,
      email: newUser.email,
      phone: newUser.phone,
      password: newUser.password,
      jobTitle: newUser.jobTitle,
      gender: newUser.gender,
      country: newUser.country,
      language: newUser.language,
      extraInfo: newUser.extraInfo,
      status: newUser.status,
    };
  };

  const handleAddUser = async (newUser) => {
    try {
      let res;
      let createdUser;

      if (newUser.role === "Student") {
        res = await createStudent(buildStudentPayload(newUser));
        createdUser = normalizeStudent(res.data.student);
      }

      if (newUser.role === "Company") {
        res = await createCompany(buildCompanyPayload(newUser));
        createdUser = normalizeCompany(res.data.company);
      }

      if (newUser.role === "Admin") {
        res = await createAdmin(buildAdminPayload(newUser));
        createdUser = normalizeAdmin(res.data.admin);
      }

      if (!createdUser) {
        setToast("Could not create user.");
        setTimeout(() => setToast(""), 3000);
        return;
      }

      setUsers((prev) => [createdUser, ...prev]);
      setSelectedUser(createdUser);
      setShowAddUserModal(false);
      setCurrentPage(1);
      setToast("User added successfully.");
    } catch (err) {
      setToast(err.response?.data?.message || "Could not add user.");
    } finally {
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

  const handleStatusChange = async (userId, newStatus) => {
    const targetUser = users.find((item) => item.id === userId);
    if (!targetUser) return;

    if (targetUser.role === "Student") {
      try {
        const res = await updateStudentStatus(userId, newStatus);
        const updated = normalizeStudent(res.data.student);
        setUsers((prev) =>
          prev.map((item) => (item.id === userId ? updated : item))
        );
        setSelectedUser(updated);
        setToast("Student status updated successfully.");
      } catch (err) {
        setToast(
          err.response?.data?.message || "Could not update student status."
        );
      } finally {
        setTimeout(() => setToast(""), 3000);
      }
      return;
    }

    if (targetUser.role === "Admin") {
      try {
        const res = await updateAdminStatus(userId, newStatus);
        const updated = normalizeAdmin(res.data.admin);
        setUsers((prev) =>
          prev.map((item) => (item.id === userId ? updated : item))
        );
        setSelectedUser(updated);
        setToast("Admin status updated successfully.");
      } catch (err) {
        setToast(
          err.response?.data?.message || "Could not update admin status."
        );
      } finally {
        setTimeout(() => setToast(""), 3000);
      }
      return;
    }

    if (targetUser.role === "Company") {
      try {
        const res = await updateCompanyStatus(userId, newStatus);
        const updatedCompany = normalizeCompany(res.data.company);

        setUsers((prev) =>
          prev.map((item) => (item.id === userId ? updatedCompany : item))
        );

        setSelectedUser(updatedCompany);
        setToast("Company status updated successfully.");
      } catch (err) {
        setToast(err.response?.data?.message || "Could not update status.");
      } finally {
        setTimeout(() => setToast(""), 3000);
      }
    }
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
          {computedStats.map((item, index) => (
            <PortalStatCard key={item.id} item={item} index={index} />
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

            {isLoading ? (
              <p>Loading users...</p>
            ) : error ? (
              <p className="company-form-error">{error}</p>
            ) : (
              <>
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
                              <div className={`admin-company-avatar tone-${item.id.length % 4}`}>
                                {item.name?.charAt(0)}
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
                            <span
                              className={`admin-user-status ${item.status
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                            >
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

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          type="button"
                          className={currentPage === page ? "active" : ""}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      )
                    )}

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