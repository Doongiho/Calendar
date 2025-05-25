import React, { useState, useEffect } from "react";
import "./InviteModal.css";
import { inviteUserToTeam, fetchInvitationsByTeam } from "../../api/teamApi";
import { FaPaperPlane } from "react-icons/fa";

export default function InviteModal({ team, onClose }) {
  const [email, setEmail] = useState("");
  const [invitedEmails, setInvitedEmails] = useState([]);

  const loadInvitedEmails = async () => {
    try {
      const data = await fetchInvitationsByTeam(team.teamId);
      setInvitedEmails(data.map((inv) => inv.invitedUserEmail));
    } catch (error) {
      console.error("❌ 초대 목록 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    loadInvitedEmails();
  }, [team.teamId]);

  const handleInvite = async () => {
    if (!email || !email.includes("@")) {
      alert("올바른 이메일을 입력하세요.");
      return;
    }
    try {
      await inviteUserToTeam(team.teamId, email);
      setEmail("");
      alert("초대가 완료되었습니다.");
      loadInvitedEmails(); 
    } catch (error) {
      console.error("❌ 초대 실패:", error);
      const serverMsg = error?.response?.data?.message;
      alert(serverMsg || "초대 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close-btn" onClick={onClose} aria-label="닫기">×</button>

        <h3>{team.teamName} 팀 초대</h3>
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
              invitedEmails.map((mail, idx) => <li key={idx}>{mail}</li>)
            ) : (
              <li>없음</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
