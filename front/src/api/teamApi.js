import axiosInstance from "./axiosInstance";

/**
 * 이메일로 사용자 ID 조회
 * @param {string} email
 * @returns {number|null}
 */
export const getUserIdByEmail = async (email) => {
  const res = await axiosInstance.get(`/api/users/email/${email}`);
  return res.data?.userId || null;
};

/**
 * 팀 생성
 * @param {object} data - { userId, teamName, description }
 * @returns {object}
 */
export const createTeam = async (data) => {
  const res = await axiosInstance.post("/api/teams", data);
  return res.data.data;
};

/**
 * 유저가 속한 팀 목록 조회
 * @param {number} userId
 * @returns {array}
 */
export const fetchTeamsByUser = async (userId) => {
  const res = await axiosInstance.get(`/api/teams/user/${userId}`);
  return res.data.data;
};

/**
 * 팀 정보 수정
 * @param {number} teamId
 * @param {object} data
 * @returns {object}
 */
export const updateTeam = async (teamId, data) => {
  const res = await axiosInstance.put(`/api/teams/${teamId}`, data);
  return res.data;
};

/**
 * 팀 삭제
 * @param {number} teamId
 * @returns {void}
 */
export const deleteTeam = async (teamId) => {
  return await axiosInstance.delete(`/api/teams/${teamId}`);
};

/**
 * 특정 팀의 팀원 목록 조회
 * @param {number} teamId
 * @returns {array}
 */
export const fetchTeamMembers = async (teamId) => {
  try {
    const res = await axiosInstance.get(`/api/teams/${teamId}/members`);
    return res.data.data;
  } catch (error) {
    console.error("팀원 목록 조회 실패:", error);
    throw error;
  }
};

/**
 * 특정 팀에서 팀원 강퇴
 * @param {number} teamId
 * @param {number} userId
 * @returns {void}
 */
export const removeTeamMember = async (teamId, userId) => {
  return await axiosInstance.delete(`/api/teams/${teamId}/members/${userId}`);
};
