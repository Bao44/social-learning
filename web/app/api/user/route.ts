import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    "Content-Type": "application/json",
  },
});

export const signUp = async ({email, password, name}:any) => {
  try {
    const response = await api.post("/api/auth/register", {
      email,
      password,
      name,
    });
    return response.data;
  } catch (error:any) {
    throw error.response?.data || error;
  }
};