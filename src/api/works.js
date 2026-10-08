import { api } from "./client";

export const getWorks = async () => {
  const response = await api.get("/works");

  return response.data;
};

export const getWork = async (id) => {
  const response = await api.get(`/works/${id}`);

  return response.data;
};
