import api from "./apiService";

export const registerStudent = (data) => {
  return api.post("/auth/student/register", data);
};

export const loginStudent = (data) => {
  return api.post("/auth/student/login", data);
};

export const loginCompany = (data) => {
  return api.post("/auth/company/login", data);
};

export const loginAdmin = (data) => {
  return api.post("/auth/admin/login", data);
};