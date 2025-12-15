import axios from "axios";

export const api = axios.create({
  baseURL: "https://cobblebode-backend.onrender.com",
});