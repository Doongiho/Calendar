import axiosInstance from "./axiosInstance";

// 로그인 API 요청
export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post("/api/users/login", {
      email,
      pwd: password,
    });
    return response.data; // { data: UserDto, message: "Success" }
  } catch (error) {
    throw error;
  }
};

// 사용자 정보 가져오기
export const getUserInfo = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("사용자 정보 가져오기 실패:", error);
    throw error;
  }
};
