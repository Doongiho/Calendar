import axiosInstance from "./axiosInstance";

export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post("/api/users/login", {
      email,
      pwd: password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
