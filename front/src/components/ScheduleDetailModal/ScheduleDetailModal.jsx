import React from "react";
import "./ScheduleDetailModal.css";

const ScheduleDetailModal = ({ schedule, onClose }) => {
  if (!schedule) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="schedule-detail-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>{schedule.title}</h3>
        <p><b>기간:</b> {schedule.startDate} {schedule.startTime} ~ {schedule.endDate} {schedule.endTime}</p>
        <p><b>장소:</b> {schedule.place}</p>
        <p><b>설명:</b> {schedule.description}</p>
        <div>
          <b>색상:</b> <span style={{ background: schedule.color, padding: '0 10px', borderRadius: '4px', color: '#fff' }}>{schedule.color}</span>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailModal;
