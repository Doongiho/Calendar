import React from "react";
import "./ScheduleDetailModal.css";

const ScheduleDetailModal = ({ schedule, onClose, onEdit }) => {
  if (!schedule) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="schedule-detail-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="닫기">×</button>
        <h3 className="schedule-title">{schedule.title}</h3>
        <p className="schedule-row"><b>기간:</b> {schedule.startDate} {schedule.startTime} ~ {schedule.endDate} {schedule.endTime}</p>
        <p className="schedule-row"><b>장소:</b> {schedule.place || <span className="schedule-empty">없음</span>}</p>
        <p className="schedule-row"><b>설명:</b> {schedule.description || <span className="schedule-empty">없음</span>}</p>
        <div className="schedule-color-row">
          <b>색상:</b>
          <span className="schedule-color-badge" style={{ background: schedule.color }}>{schedule.color}</span>
        </div>
        <div className="btn-group">
          <button
            className="edit-btn"
            onClick={e => {
              e.stopPropagation();
              onEdit && onEdit(schedule);
            }}
          >
            수정하기
          </button>
                  <button
            className="edit-btn"
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailModal;
