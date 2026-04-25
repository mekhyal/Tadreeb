import api from "./apiService";

export const getOpportunities = () => api.get("/opportunities");

export const createOpportunity = (data) => api.post("/opportunities", data);

export const updateOpportunity = (id, data) =>
  api.put(`/opportunities/${id}`, data);

export const deleteOpportunity = (id) => api.delete(`/opportunities/${id}`);