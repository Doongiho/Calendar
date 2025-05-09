import React, { useState } from "react";
import "./ScheduleForm.css";

export default function ScheduleForm({
  initialDate,
  onClose,
  onSubmit,
  schedule,
}) {
  const [title, setTitle] = useState(schedule?.title || "");
  const [startDate, setStartDate] = useState(
    schedule?.startDate || initialDate
  );
  const [startTime, setStartTime] = useState(schedule?.startTime || "09:00");
  const [endDate, setEndDate] = useState(schedule?.endDate || initialDate);
  const [endTime, setEndTime] = useState(schedule?.endTime || "18:00");
  const [place, setPlace] = useState(schedule?.place || "");
  const [color, setColor] = useState(schedule?.color || "BLUE");
  const [description, setDescription] = useState(schedule?.description || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      alert("제목을 입력하세요.");
      return;
    }

    const startDateTime = `${startDate}T${startTime}`;
    const endDateTime = `${endDate}T${endTime}`;
    onSubmit({
      ...schedule,
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="schedule-form-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <form onSubmit={handleSubmit}>
          <label>제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="schedule-row">
            <div className="schedule-col">
              <label>시작일자</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="schedule-col">
              <label>시작시간</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="schedule-row">
            <div className="schedule-col">
              <label>종료일자</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="schedule-col">
              <label>종료시간</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <label>장소</label>
          <input value={place} onChange={(e) => setPlace(e.target.value)} />

          <label>일정 색상</label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          >
            <option value="RED">빨강</option>
            <option value="BLUE">파랑</option>
            <option value="GREEN">초록</option>
            <option value="YELLOW">노랑</option>
            <option value="PURPLE">보라</option>
          </select>

          <label>설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="button-group">
            <button type="submit" className="submit-btn">
              {schedule ? "확인" : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
