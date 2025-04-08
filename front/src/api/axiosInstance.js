import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // API 서버 주소
  withCredentials: true, // 쿠키 및 인증 정보 포함
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
