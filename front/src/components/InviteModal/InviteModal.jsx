import React, { useState } from "react";
import "./InviteModal.css";
import { getUserIdByEmail, inviteUserToTeam } from "../../api/teamApi";

export default function InviteModal({ team, onClose }) {
  const [email, setEmail] = useState("");
  const [invitedEmails, setInvitedEmails] = useState([]);

  const handleInvite = async () => {
    if (!email || !email.includes("@")) {
      alert("유효한 이메일을 입력하세요.");
      return;
    }

    try {
      const userId = await getUserIdByEmail(email); 
      if (!userId) {
        alert("해당 사용자를 찾을 수 없습니다.");
        return;
      }

      await inviteUserToTeam(team.teamId, userId);
      setInvitedEmails((prev) => [...prev, email]);
      setEmail("");
      alert("초대가 완료되었습니다.");
    } catch (error) {
      console.error("초대 실패:", error);
      alert("초대 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{team.teamName} 팀 초대</h3>
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleInvite}>초대하기</button>

        <div className="invite-list">
          <strong>초대한 이메일 목록:</strong>
          <ul>
            {invitedEmails.map((mail, idx) => (
              <li key={idx}>{mail}</li>
            ))}
          </ul>
        </div>

        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}
