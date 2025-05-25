import axiosInstance from "./axiosInstance";

export const fetchReceivedInvitations = async (userId, userEmail) => {
  const teamsRes = await axiosInstance.get(`/api/teams/user/${userId}`);
  const teams = teamsRes.data.data;

  const allInvitations = [];

  for (const team of teams) {
    const res = await axiosInstance.get(`/api/teams/${team.teamId}/invitations`);
    const invitations = res.data.data;

    console.log(`[${team.teamName}] 초대 목록`, invitations);

    const myInvitations = invitations.filter((inv) => {
      const match = inv.invitedUserEmail?.toLowerCase() === userEmail.toLowerCase();
      if (match) {
        console.log("초대된 항목:", inv);
      }
      return match;
    });

    myInvitations.forEach((inv) => {
      inv.teamName = team.teamName;
    });

    allInvitations.push(...myInvitations);
  }

  console.log("최종 내 초대 목록:", allInvitations);

  return allInvitations;
};
