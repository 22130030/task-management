import axios from "axios";

const api = axios.create({
  baseURL: "https://taskflow-api-3b5f.onrender.com",
});

export default api;