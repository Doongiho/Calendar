import React, { useState } from "react";
import "./EditTeamModal.css";

export default function EditTeamModal({ team, onClose, onUpdate }) {
  const [teamName, setTeamName] = useState(team.teamName);
  const [description, setDescription] = useState(team.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ teamId: team.teamId, teamName, description });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button type="button" className="close-btn" onClick={onClose}>×</button>
        <h3>팀 수정</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="팀 이름"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="팀 설명"
          />
          <div className="modal-buttons">
            <button type="submit" className="submit-btn">저장</button>
          </div>
        </form>
      </div>
    </div>
  );
}
