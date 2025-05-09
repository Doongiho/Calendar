import React from "react";
import "./ScheduleDetailModal.css";

const colorMap = {
  RED: "#f44336",
  BLUE: "#2196f3",
  GREEN: "#4caf50",
  YELLOW: "#ffeb3b",
  PURPLE: "#9c27b0",
};

const ScheduleDetailModal = ({ schedule, onClose, onEdit, onDelete }) => {
  if (!schedule) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="schedule-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose} aria-label="닫기">
          ×
        </button>
        <h3 className="schedule-title">{schedule.title}</h3>
        <p className="schedule-row">
          <b>기간:</b> {schedule.startDate} {schedule.startTime} ~{" "}
          {schedule.endDate} {schedule.endTime}
        </p>
        <p className="schedule-row">
          <b>장소:</b>{" "}
          {schedule.place || <span className="schedule-empty">없음</span>}
        </p>
        <p className="schedule-row">
          <b>설명:</b>{" "}
          {schedule.description || <span className="schedule-empty">없음</span>}
        </p>
        <div className="schedule-color-row">
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
