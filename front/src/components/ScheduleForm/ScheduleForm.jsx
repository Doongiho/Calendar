import React, { useState } from "react";
import "./ScheduleForm.css";

export default function ScheduleForm({
  initialDate,
  onClose,
  onSubmit,
  schedule,
}) {
  const extractDate = (iso) => {
    if (!iso) return initialDate;
    const dateObj = new Date(iso);
    if (isNaN(dateObj.getTime())) return iso.split("T")[0];
    return dateObj.toISOString().split("T")[0];
  };
  
  const extractTime = (iso) => {
    if (!iso) return "09:00";
    const dateObj = new Date(iso);
    if (isNaN(dateObj.getTime())) return "09:00";
    return dateObj.toTimeString().slice(0, 5); 
  };
  
  
  
  const [title, setTitle] = useState(schedule?.title || "");
  const [startDate, setStartDate] = useState(extractDate(schedule?.startDate));
  const [startTime, setStartTime] = useState(
    schedule?.startTime || extractTime(schedule?.startDate)
  );
  const [endDate, setEndDate] = useState(extractDate(schedule?.endDate));
  const [endTime, setEndTime] = useState(
    schedule?.endTime || extractTime(schedule?.endDate)
  );
  
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
      startDate: `${startDate}T${startTime}`,
      endDate: `${endDate}T${endTime}`,
      startTime, 
      endTime, 
      color,
      description,
    });
    onClose();
    
    console.log("startDateTime", startDateTime); 
    console.log("endDateTime", endDateTime);
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
