// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://85.121.120.156:5072/api",
// });

// API.interceptors.request.use((req:any) => {
//   if (typeof window !== "undefined") {
//     const token = localStorage.getItem("token");
//     if (token) (req as any).headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

// export default API;

import axios from "axios";

const API = axios.create({
  // baseURL: "http://85.121.120.156:5072/api",
  baseURL: "https://api.skillbarter.codevocab.com/api"
});

// REQUEST INTERCEPTOR
API.interceptors.request.use((req: any) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }

  return req;
});

// RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;