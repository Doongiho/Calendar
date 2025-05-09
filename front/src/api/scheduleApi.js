import axiosInstance from "./axiosInstance";

export const fetchUserSchedules = (userId) =>
  axiosInstance.get(`/api/schedules/user/${userId}`);

export const fetchSchedule = (scheduleId) =>
  axiosInstance.get(`/api/schedules/${scheduleId}`);

export const createSchedule = (data) =>
  axiosInstance.post("/api/schedules/", data);

export const updateSchedule = (scheduleId, data) =>
  axiosInstance.put(`/api/schedules/${scheduleId}`, data);

export const deleteSchedule = (scheduleId) =>
  axiosInstance.delete(`/api/schedules/${scheduleId}`);
