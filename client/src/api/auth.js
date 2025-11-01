import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

// ✅ Register user
export const registerUser = async (userData) => {
  const res = await API.post("/register", userData);
  return res.data;
};

// ✅ Login user
export const loginUser = async (userData) => {
  const res = await API.post("/login", userData);
  return res.data;
};
