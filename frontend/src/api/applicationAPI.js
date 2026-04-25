import api from "./apiService";

export const applyToProgram = (programID) =>
  api.post("/applications", { programID });

export const getMyApplications = () => api.get("/applications/my");

export const getCompanyApplications = () => api.get("/applications/company");

export const updateApplicationStatus = (id, status, decisionNote) =>
  api.patch(`/applications/${id}/status`, { status, decisionNote });