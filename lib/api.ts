import axios from "axios";

const API = axios.create({
  baseURL: "http://85.121.120.156:5072/api",
});

API.interceptors.request.use((req:any) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) (req as any).headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
