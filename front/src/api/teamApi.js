import axiosInstance from "./axiosInstance";

export const getUserIdByEmail = async (email) => {
  const res = await axiosInstance.get(`/api/users/email/${email}`);
  return res.data?.userId || null;
};

export const createTeam = async (data) => {
  const res = await axiosInstance.post("/api/teams", data);
  return res.data.data; 
};


export const inviteUserToTeam = async (teamId, userId) => {
  return await axiosInstance.post(`/api/teams/${teamId}/invitations?invitedUserId=${userId}`);
};

export const fetchTeamsByUser = async (userId) => {
  const response = await axiosInstance.get(`/api/teams/user/${userId}`);
  return response.data.data; 
};

export const deleteTeam = async (teamId) => {
  return await axiosInstance.delete(`/api/teams/${teamId}`);
};

