import axios from "axios";

const NODE_API_URL =
  import.meta.env.VITE_PUBLIC_NODE_DEPLOYMENT_URL ||
  import.meta.env.VITE_PUBLIC_NODE_LOCAL_URL;

const api = axios.create({
  baseURL: NODE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
