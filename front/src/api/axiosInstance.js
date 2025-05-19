import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // API 서버 주소
  withCredentials: true, // 쿠키 및 인증 정보 포함
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const isLoginRequest = config.url.includes('/api/users/login');
  if (!isLoginRequest) {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { token } = JSON.parse(storedUser);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});



export default axiosInstance;
