import axiosInstance from "./axiosInstance";

/**
 * 팀 일정 전체 조회
 * @param {number} teamId
 * @returns {Promise<Array>}
 */
export const fetchTeamSchedules = async (teamId) => {
  const res = await axiosInstance.get(`/api/team-schedules/team/${teamId}`);
  return res.data;
};

/**
 * 팀 일정 생성
 * @param {object} data - { userId, teamId, title, description, color, startDate, endDate }
 * @returns {Promise<object>}
 */
export const createTeamSchedule = async (data) => {
  console.log("👉 일정 등록 직전 토큰 확인", localStorage.getItem("user"));
  const res = await axiosInstance.post("/api/team-schedules", data);
  return res.data;
};


/**
 * 팀 일정 수정
 * @param {number} scheduleId
 * @param {object} data
 * @returns {Promise<object>}
 */
export const updateTeamSchedule = async (scheduleId, data) => {
  const res = await axiosInstance.put(`/api/team-schedules/${scheduleId}`, data);
  return res.data;
};

/**
 * 팀 일정 삭제
 * @param {number} scheduleId
 * @returns {Promise<void>}
 */
export const deleteTeamSchedule = async (scheduleId) => {
  return await axiosInstance.delete(`/api/team-schedules/${scheduleId}`);
};
