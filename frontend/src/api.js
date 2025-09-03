import axios from "axios";

// Base URL of your backend
const API = axios.create({
  baseURL: "http://localhost:5000", // change this to your backend deployed URL if needed
});

// Optionally, you can intercept requests to include auth tokens
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
