import React, { useState, useEffect } from "react"; 
import "./InviteModal.css";
import { inviteUserToTeam, fetchInvitationsByTeam, cancelInvitation } from "../../api/teamApi";
import { fetchPendingInvitations } from "../../api/invitationApi";
import { useUser } from "../../contexts/UserContext";
import { FaPaperPlane } from "react-icons/fa";

export default function InviteModal({ team, onClose, setInvitations  }) {
  const [email, setEmail] = useState("");
  const [invitedEmails, setInvitedEmails] = useState([]);
  const { user } = useUser();

  const handleCancelInvitation = async (invitationId) => {
    if (!window.confirm("이 초대를 취소하시겠습니까?")) return;
    try {
      await cancelInvitation(team.teamId, invitationId);
      alert("초대가 취소되었습니다.");
      setInvitedEmails((prev) =>
        prev.filter((inv) => inv.invitationId !== invitationId)
      );
    } catch (error) {
      console.error("초대 취소 실패:", error);
      alert("초대 취소 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const fetchTeamInvitations = async () => {
      if (!team?.teamId) return;
      try {
        const data = await fetchInvitationsByTeam(team.teamId);
        setInvitedEmails(data);
      } catch (error) {
        console.error("팀 초대 목록 불러오기 실패:", error);
      }
    };
  
    fetchTeamInvitations();
  }, [team?.teamId]);

  const handleInvite = async () => {
    if (!email || !email.includes("@")) {
      alert("올바른 이메일을 입력하세요.");
      return;
    }
    try {
      const result = await inviteUserToTeam(team.teamId, email);  
      console.log("초대한 결과:", result);
      setInvitedEmails((prev) => [...prev, result]);              
      setEmail("");
      alert("초대가 완료되었습니다.");
    } catch (error) {
      console.error("초대 실패:", error);
      const serverMsg = error?.response?.data?.message;
      alert(serverMsg || "초대 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close-btn" onClick={onClose} aria-label="닫기">×</button>
        <h3>팀 초대</h3>
        <h3>{team.teamName}</h3>
        <div className="input-div">
          <input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="icon-button" onClick={handleInvite} title="초대하기">
            <FaPaperPlane />
          </button>
        </div>
        <div className="invite-list">
          <strong>초대한 이메일 목록:</strong>
          <ul>
            {invitedEmails.length > 0 ? (
              invitedEmails.map(({ invitedUserEmail, invitationId }) => (
                <li className="invitationList" key={invitationId}>
                  {invitedUserEmail}
                  <button onClick={() => handleCancelInvitation(invitationId)} className="cancel-btn">
                    취소
                  </button>
                </li>
              ))
            ) : (
              <li>초대보낸 사람이 없습니다.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
