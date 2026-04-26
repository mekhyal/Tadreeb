import api from "./apiService";

// Public — no token required; axios still sends an empty body correctly
export const submitCompanyRequest = (payload) =>
  api.post("/company-requests", payload);
