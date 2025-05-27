import axiosInstance from "./axiosInstance";

/**
 * 특정 이메일로 팀 초대 전송
 * @param {number} teamId
 * @param {string} email
 * @returns {object}
 */
export const inviteUserToTeam = async (teamId, email) => {
  try {
    const res = await axiosInstance.post(`/api/teams/${teamId}/invitations`, {
      invitedUserEmail: email,
    });
    return res.data.data;
  } catch (error) {
    console.error("초대 실패:", error);
    const msg = error?.response?.data?.message;
    alert(msg || "초대 중 오류가 발생했습니다.");
    throw error;
  }
};

/**
 * 특정 팀의 전체 초대 현황 조회
 * @param {number} teamId
 * @returns {array}
 */
export const fetchTeamInvitations = async (teamId) => {
  try {
    const res = await axiosInstance.get(`/api/teams/${teamId}/invitations`);
    return res.data.data;
  } catch (error) {
    console.error("팀 초대 현황 조회 실패:", error);
    throw error;
  }
};

/**
 * 초대 취소
 * @param {number} teamId
 * @param {number} invitationId
 */
export const cancelInvitation = async (teamId, invitationId) => {
  return await axiosInstance.delete(
    `/api/teams/${teamId}/invitations/${invitationId}`
  );
};

/**
 * 사용자 기준 대기 중인 초대 조회
 * @param {number} userId
 * @returns {array}
 */
export const fetchPendingInvitations = async (userId) => {
  const res = await axiosInstance.get(
    `/api/users/${userId}/invitations/pending`
  );
  return res.data.data;
};

/**
 * 초대 수락
 * @param {number} invitationId
 */
export const acceptInvitation = async (userId, invitationId) => {
  return await axiosInstance.put(
    `/api/teams/invitations/${invitationId}/accept`
  );
};

/**
 * 초대 거절
 * @param {number} invitationId
 */
export const rejectInvitation = async (userId, invitationId) => {
  return await axiosInstance.put(
    `/api/teams/invitations/${invitationId}/reject`
  );
};
