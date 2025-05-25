import axiosInstance from "./axiosInstance";

export const fetchPendingInvitations = async (userId) => {
  const res = await axiosInstance.get(`/api/users/${userId}/invitations/pending`);
  return res.data.data;
};

export const acceptInvitation = async (userId, invitationId) => {
  return await axiosInstance.put(`/api/teams/invitations/${invitationId}/accept`);
};

export const rejectInvitation = async (userId, invitationId) => {
  return await axiosInstance.put(`/api/teams/invitations/${invitationId}/reject`);
};
