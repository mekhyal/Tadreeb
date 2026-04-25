import api from "./apiService";

export const getStudents = () => api.get("/admin/students");
export const getCompanies = () => api.get("/admin/companies");
export const getAdmins = () => api.get("/admin/admins");

export const createStudent = (data) => api.post("/admin/create-student", data);
export const createCompany = (data) => api.post("/admin/create-company", data);
export const createAdmin = (data) => api.post("/admin/create-admin", data);

export const updateCompanyStatus = (id, status) =>
  api.put(`/admin/companies/${id}/status`, { status });