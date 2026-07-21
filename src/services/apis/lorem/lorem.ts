import { create } from "axios";

const loremApi = create({
  baseURL: "https://lorem-api.com/api",
});

export default loremApi;
