import React, { useState } from "react";
import "./ScheduleForm.css";

export default function ScheduleForm({ 
  initialDate, 
  onClose, 
  onSubmit 
}) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(initialDate);
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState(initialDate);
  const [endTime, setEndTime] = useState("18:00");
  const [place, setPlace] = useState("");
  const [color, setColor] = useState("#545cf5");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      alert("제목을 입력하세요.");
      return;
    }

    const startDateTime = `${startDate}T${startTime}`;
    const endDateTime = `${endDate}T${endTime}`;
    onSubmit({
      title,
      startDate,
      startTime,
      startDateTime,
      endDate,
      endTime,
      endDateTime,
      place,
      color,
      description,
    });
    onClose();
  };

  return (
    <div 
        className="modal-overlay"
        onClick={onClose}
    >
      <div className="schedule-form-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <form onSubmit={handleSubmit}>
          <label>제목</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required />

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <label>시작일자</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            </div>
            <div style={{ flex: 1 }}>
              <label>시작시간</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <label>종료일자</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
            </div>
            <div style={{ flex: 1 }}>
              <label>종료시간</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
            </div>
          </div>

          <label>장소</label>
          <input value={place} onChange={e => setPlace(e.target.value)} />

          <label>일정 색상</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} />

          <label>설명</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} />

          <button type="submit" className="submit-btn">저장</button>
        </form>
      </div>
    </div>
  );
}
