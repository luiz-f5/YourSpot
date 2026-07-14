import { create } from "axios";

const api = create({
  baseURL: "https://lorem-api.com/api",
});

export default api;
