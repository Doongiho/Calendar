import { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import {
  cancelInvitation,
  fetchTeamInvitations,
  inviteUserToTeam,
} from "../../api/invitationApi";
import { fetchTeamMembers, removeTeamMember } from "../../api/teamApi";
import "./InviteModal.css";
import { useUser } from "../../contexts/UserContext";

export default function InviteModal({ team, onClose }) {
  const { user } = useUser();
  const [email, setEmail] = useState("");
  const [pendingInvites, setPendingInvites] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    if (!team?.teamId) return;

    const loadData = async () => {
      try {
        const [invitations, members] = await Promise.all([
          fetchTeamInvitations(team.teamId),
          fetchTeamMembers(team.teamId),
        ]);

        const pending = invitations.filter((inv) => inv.status === "PENDING");

        setPendingInvites(pending);
        setTeamMembers(members);
      } catch (error) {
        console.error("초대/팀원 데이터 불러오기 실패:", error);
      }
    };

    loadData();
  }, [team?.teamId]);

  const handleInvite = async () => {
    if (!email || !email.includes("@")) {
      alert("올바른 이메일을 입력하세요.");
      return;
    }

    const alreadyMember = teamMembers.some((m) => m.email === email);
    if (alreadyMember) {
      alert("이미 팀에 속한 사용자입니다.");
      return;
    }

    const alreadyInvited = pendingInvites.some(
      (i) => i.invitedUserEmail === email
    );
    if (alreadyInvited) {
      alert("이미 초대된 사용자입니다.");
      return;
    }

    try {
      await inviteUserToTeam(team.teamId, email);
      alert("초대가 전송되었습니다.");
      setEmail("");

      const updated = await fetchTeamInvitations(team.teamId);
      setPendingInvites(updated.filter((i) => i.status === "PENDING"));
    } catch (error) {
      console.error("초대 실패:", error);
      const msg = error?.response?.data?.message;
      alert(msg || "초대 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = async (invitationId) => {
    if (!window.confirm("이 초대를 취소하시겠습니까?")) return;

    try {
      await cancelInvitation(team.teamId, invitationId);
      alert("초대가 취소되었습니다.");

      const updated = await fetchTeamInvitations(team.teamId);
      setPendingInvites(updated.filter((i) => i.status === "PENDING"));
    } catch (error) {
      console.error("초대 취소 실패:", error);
      alert("초대 취소 중 오류가 발생했습니다.");
    }
  };

  const handleRemoveMember = async (userId, email) => {
    if (!window.confirm(`${email} 님을 정말 강퇴하시겠습니까?`)) return;

    try {
      await removeTeamMember(team.teamId, userId);
      alert("강퇴되었습니다.");

      const updatedMembers = await fetchTeamMembers(team.teamId);
      setTeamMembers(updatedMembers);
    } catch (error) {
      console.error("팀원 강퇴 실패:", error);
      alert("강퇴 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h3>팀 초대</h3>
        <h3>{team.teamName}</h3>

        <div className="input-div">
          <input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="icon-button" onClick={handleInvite}>
            <FaPaperPlane />
          </button>
        </div>

        <div className="invite-list">
          <strong>대기 중 초대:</strong>
          <ul>
            {pendingInvites.length > 0 ? (
              pendingInvites.map(({ invitedUserEmail, invitationId }) => (
                <li key={invitationId} className="canel-gub">
                  {invitedUserEmail}
                  <button
                    onClick={() => handleCancel(invitationId)}
                    className="cancel-btn"
                  >
                    취소
                  </button>
                </li>
              ))
            ) : (
              <li>대기 중인 초대가 없습니다.</li>
            )}
          </ul>
        </div>
        <div className="team-members">
          <strong>팀원 목록:</strong>
          <ul>
          {teamMembers.map((member) => (
            <li key={member.userId} className="canel-gub">
              {member.userEmail}
              {Number(member.userId) !== Number(user?.userId) && (
                <button
                  onClick={() =>
                    handleRemoveMember(member.userId, member.userEmail)
                  }
                  className="kick-btn"
                >
                  강퇴
                </button>
              )}
            </li>
          ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
