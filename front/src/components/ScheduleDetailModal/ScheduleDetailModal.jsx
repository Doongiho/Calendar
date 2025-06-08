import React from "react";
import "./ScheduleDetailModal.css";

const colorMap = {
  RED: "#f44336",
  BLUE: "#2196f3",
  GREEN: "#4caf50",
  YELLOW: "#ffeb3b",
  PURPLE: "#9c27b0",
};

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

const ScheduleDetailModal = ({ schedule, onClose, onEdit, onDelete, teamId, memberMap }) => {
  if (!schedule) return null;

  const writerName =
  teamId && schedule.userId
    ? memberMap?.[Number(schedule.userId)] || `사용자#${schedule.userId}`
    : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="schedule-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="닫기">
          ×
        </button>
        <h3 className="schedule-title">{schedule.title}</h3>

        <p className="schedule-row">
          <b>시작일자:</b> {formatDateTime(schedule.startDate)}
        </p>
        <p className="schedule-row">
          <b>종료일자:</b> {formatDateTime(schedule.endDate)}
        </p>

        <p className="schedule-row">
          <b>설명:</b>{" "}
          {schedule.description || <span className="schedule-empty">없음</span>}
        </p>

        <div className="schedule-row">
          <b>색상:</b>
          <span
            className="schedule-color-badge"
            style={{
              background: colorMap[schedule.color] || "#ccc",
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            {schedule.color}
          </span>
        </div>
        {writerName && (
          <p className="schedule-row">
            <b>작성자:</b> {writerName}
          </p>
        )}
        <div className="btn-group">
          <button
            className="edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit && onEdit(schedule);
            }}
          >
            수정하기
          </button>
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("정말 삭제하시겠습니까?")) {
                onDelete && onDelete(schedule);
              }
            }}
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
};


export default ScheduleDetailModal;