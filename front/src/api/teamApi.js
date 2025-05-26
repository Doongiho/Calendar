import axiosInstance from "./axiosInstance";

// 사용자 관련

/**
 * 이메일로 사용자 ID 조회
 * @param {string} email
 * @returns {number|null}
 */
export const getUserIdByEmail = async (email) => {
  const res = await axiosInstance.get(`/api/users/email/${email}`);
  return res.data?.userId || null;
};

//  팀 관련

/**
 * 팀 생성
 * @param {object} data - { userId, teamName, description }
 * @returns {object} 생성된 팀 정보
 */
export const createTeam = async (data) => {
  const res = await axiosInstance.post("/api/teams", data);
  return res.data.data;
};

/**
 * 유저가 속한 팀 목록 조회
 * @param {number} userId
 * @returns {array} 팀 목록
 */
export const fetchTeamsByUser = async (userId) => {
  const res = await axiosInstance.get(`/api/teams/user/${userId}`);
  return res.data.data;
};

/**
 * 팀 정보 수정
 * @param {number} teamId
 * @param {object} data - 수정할 팀 정보
 * @returns {object} 수정 결과
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

// 팀 초대 관련

/**
 * 특정 이메일로 팀 초대 전송
 * @param {number} teamId
 * @param {string} email
 * @returns {object} 
 */
export const inviteUserToTeam = async (teamId, email) => {
  const res = await axiosInstance.post(`/api/teams/${teamId}/invitations`, {
    invitedUserEmail: email,
  });
  return res.data.data;
};

/**
 * 해당 팀의 초대 목록 조회
 * @param {number} teamId
 * @returns {array} 초대 정보 목록
 */
export const fetchInvitationsByTeam = async (teamId) => {
  const res = await axiosInstance.get(`/api/teams/${teamId}/invitations`);
  return res.data.data;
};

/**
 * 특정 초대를 취소(삭제)합니다.
 * @param {number} teamId - 초대가 속한 팀의 ID
 * @param {number} invitationId - 취소할 초대의 ID
 * @returns {Promise<void>} 삭제 요청 결과
 */

export const cancelInvitation = async (teamId, invitationId) => {
  return await axiosInstance.delete(`/api/teams/${teamId}/invitations/${invitationId}`);
};
