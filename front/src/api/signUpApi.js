import axiosInstance from './axiosInstance';

// 회원가입 API 요청
export const registerUser = async (
  email,
  password,
  confirmPassword,
  name,
  gender
) => {
  try {
    const response = await axiosInstance.post('/api/users/register', {
      email,
      pwd: password, // ✅ DB 컬럼에 맞게 pwd 사용
      confirmPassword,
      name,
      gender,
    });
    return response.data; // { data: UserDto, message: "Success" }
  } catch (error) {
    console.error('회원가입 실패:', error);
    throw error;
  }
};
