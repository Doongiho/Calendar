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

  // 사용자 정보 수정하기
  export const updateUserInfo = async (userId, updatedUserData) => {
    try {
      // 서버의 UserDto 형식에 맞춰 요청 바디 구성
      const requestBody = {
        userId: userId,
        email: updatedUserData.email,
        pwd: updatedUserData.pwd,         // 반드시 'pwd'로!
        name: updatedUserData.name,
        gender: updatedUserData.gender    // 0 또는 1
      };
  
      const response = await axiosInstance.put(`/api/users/${userId}`, requestBody);
      return response.data;
    } catch (error) {
      console.error("사용자 정보 수정 실패:", error);
      throw error;
    }
  };

  // 회원 탈퇴 API
export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('회원 탈퇴 실패:', error);
    throw error;
  }
};

