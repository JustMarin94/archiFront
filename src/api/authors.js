import { api } from "./client";

export const getAuthors = async () => {
  const response = await api.get("/authors");

  return response.data;
};
