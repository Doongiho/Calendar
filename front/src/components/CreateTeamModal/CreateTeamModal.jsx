import React, { useState } from "react";
import "./CreateTeamModal.css";

export default function CreateTeamModal({ onClose, onCreate }) {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      alert("캘린더 제목을 입력해주세요.");
      return;
    }

    try {
      await onCreate({ teamName, description });
      alert("팀이 생성되었습니다.");
    } catch (error) {
      alert("팀 생성 실패");
      console.error(error);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button type="button" onClick={onClose} className="close-btn">
                ×
        </button>
        <h3>팀 일정표 만들기</h3>
        <form onSubmit={handleCreateTeam}>
          <label>캘린더 제목</label>
          <input
            type="text"
            placeholder="캘린더 제목을 입력해주세요"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <label>내용</label>
          <input
            type="text"
            placeholder="캘린더 내용을 입력해주세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="modal-buttons">
            <button type="submit" className="submit-btn">
              만들기
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
