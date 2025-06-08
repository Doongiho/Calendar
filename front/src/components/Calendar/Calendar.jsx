import React, { useState, useEffect } from "react";
import "./Calendar.css";
import ScheduleForm from "../ScheduleForm/ScheduleForm";
import ScheduleDetailModal from "../ScheduleDetailModal/ScheduleDetailModal";
import {
  fetchUserSchedules,      
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../../api/scheduleApi";
import {
  fetchTeamSchedules,
  createTeamSchedule,
  updateTeamSchedule,
  deleteTeamSchedule
} from "../../api/teamScheduleApi";
import { useUser } from "../../contexts/UserContext";

const Calendar = ({ onDateSelect, teamId }) => {
  const { user } = useUser(); 
  const userId = user?.userId;
  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  useEffect(() => {
    if (teamId) {
      fetchTeamSchedules(teamId)
        .then((res) => setSchedules(res.data))
        .catch((err) => console.error("팀 일정 로드 실패:", err));
    } else if (userId) {
      fetchUserSchedules(userId)
        .then((res) => setSchedules(res.data))
        .catch((err) => console.error("개인 일정 로드 실패:", err));
    }
  }, [userId, teamId]);
  

  const formattedDate = (date) => {
    const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };

  const diffDays = (from, to) => Math.abs(to - from) / 86400000;

  const eachCalendarDates = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDay();
    const from = new Date(currentYear, currentMonth, 1 - firstDay);
    const to = new Date(currentYear, currentMonth + 1, 7 - (lastDay + 1));
    return Array.from({ length: diffDays(from, to) + 1 }, (_, i) => {
      if (i !== 0) from.setDate(from.getDate() + 1);
      return new Date(from);
    });
  };

  const isEqualDate = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const classNames = (date) => {
    const today = new Date();
    const classes = [];
    if (isEqualDate(date, today)) classes.push("today");
    if (date.getMonth() !== currentMonth) classes.push("muted");
    if (date.getDay() === 0) classes.push("sunday");
    return classes.join(" ");
  };

  const handleNavigationClick = (delta) => {
    setCurrentDate(new Date(currentYear, currentMonth + delta));
  };

  const handleDateClick = (date) => {
    const dateStr = formattedDate(date);
    setSelectedDate(dateStr);
    setShowForm(true);
    onDateSelect?.(dateStr);
  };

  const handleEdit = (schedule) => {
    setSelectedSchedule(null);
    setEditingSchedule(schedule);
    setShowForm(true);
  };

  const handleDelete = (schedule) => {
    const id = schedule.scheduleId || schedule.id;
    if (!id) return alert("삭제할 일정 ID가 없습니다.");
  
    const deleteFn = teamId ? deleteTeamSchedule : deleteSchedule;
  
    deleteFn(id)
      .then(() => {
        setSchedules((prev) => prev.filter((s) => (s.scheduleId || s.id) !== id));
      })
      .catch((err) => {
        console.error("일정 삭제 중 오류:", err);
        alert("일정 삭제 중 오류 발생");
      });
  };

  const handleFormSubmit = (schedule) => {
    const payload = {
      ...schedule,
      userId: user?.userId,
      teamId: teamId ? Number(teamId) : undefined,
    };
  
    if (schedule.scheduleId) {
      const updateFn = teamId ? updateTeamSchedule : updateSchedule;
      updateFn(schedule.scheduleId, payload)
        .then((res) => {
          const updated = {
            ...res.data,
            id: res.data.scheduleId,
            startDate: res.data.startDate.slice(0, 10),
            endDate: res.data.endDate.slice(0, 10)
          };
          setSchedules((prev) =>
            prev.map((s) => (s.scheduleId === updated.id ? updated : s))
          );
        });
    } else {
      const createFn = teamId ? createTeamSchedule : createSchedule;
      createFn(payload)
        .then((res) => {
          const created = {
            ...res.data,
            id: res.data.scheduleId,
            startDate: res.data.startDate.slice(0, 10),
            endDate: res.data.endDate.slice(0, 10)
          };
          setSchedules((prev) => [...prev, created]);
        });
    }
  };
  
  
  
  

  return (
    <div className={`calendar-container ${teamId ? "team-mode" : ""}`}>
      <div className="calendar-nav">
        <i className="prev bx bx-chevron-left" onClick={() => handleNavigationClick(-1)}></i>
        <div className="calendar-title">
          <h2>{currentYear}년 {monthNames[currentMonth]}</h2>
        </div>
        <i className="next bx bx-chevron-right" onClick={() => handleNavigationClick(1)}></i>
      </div>

      <div className="calendar-grid">
        {dayNames.map((dayName) => (
          <div key={dayName} className="day-header">{dayName}</div>
        ))}
        {eachCalendarDates().map((date) => (
          <div
            key={formattedDate(date)}
            className={`day-cell ${classNames(date)}`}
            onClick={() => handleDateClick(date)}
          >
            <div className="date-number">{date.getDate()}</div>
            <div className="todo-list-wrap">
              {schedules.filter(
                (s) =>
                  formattedDate(new Date(s.startDate)) <= formattedDate(date) &&
                  formattedDate(new Date(s.endDate)) >= formattedDate(date)
              )
                .map((s, idx) => (
                  <div
                    key={idx}
                    className="todo-item"
                    style={{ backgroundColor: s.color }}
                    title={s.title}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSchedule(s);
                    }}
                  >
                    {s.title}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ScheduleForm
          initialDate={selectedDate}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
          schedule={editingSchedule}
        />
      )}

      {selectedSchedule && (
        <ScheduleDetailModal
          schedule={selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Calendar;