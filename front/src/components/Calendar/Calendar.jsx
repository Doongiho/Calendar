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

const Calendar = ({ onDateSelect, userId }) => {
  const DEFAULT_SIZE = window.innerWidth;
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const [currentDate, setCurrentDate] = useState(new Date());
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserSchedules(userId)
        .then((res) => {
          setSchedules(res.data);
        })
        .catch((err) => console.error("일정 불러오기 실패:", err));
    }
  }, [userId]);

  const formattedDate = (date) => {
    const format = (n) => (n < 10 ? `0${n}` : `${n}`);
    return `${date.getFullYear()}-${format(date.getMonth() + 1)}-${format(
      date.getDate()
    )}`;
  };

  const diffDays = (from, to) => {
    const MILLISECONDS_PER_DAY = 86_400_000;
    return Math.abs(to - from) / MILLISECONDS_PER_DAY;
  };

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

  const handleEdit = (scheduleToEdit) => {
    setSelectedSchedule(null);
    setEditingSchedule(scheduleToEdit);
    setShowForm(true);
  };

  const handleDelete = (scheduleToDelete) => {
    const id = scheduleToDelete.scheduleId || scheduleToDelete.id;

    if (!id) {
      alert("삭제할 일정 ID가 없습니다.");
      return;
    }

    deleteSchedule(id)
      .then(() => {
        setSchedules((prev) =>
          prev.filter((s) => (s.scheduleId || s.id) !== id)
        );
        setSelectedSchedule(null);
      })
      .catch((err) => {
        console.error("일정 삭제 실패:", err);
        alert("일정 삭제 중 오류가 발생했습니다.");
      });
  };

  const handleFormSubmit = (schedule) => {
    const id = schedule.scheduleId || schedule.id;

    const payload = {
      title: schedule.title,
      description: schedule.description,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      color: schedule.color,
      userId: Number(userId),
    };

    if (id) {
      // ✅ 수정
      updateSchedule(id, payload)
        .then((res) => {
          const updated = {
            ...res.data,
            id: res.data.scheduleId,
          };
          setSchedules((prev) =>
            prev.map((s) => ((s.id || s.scheduleId) === id ? updated : s))
          );
        })
        .catch((err) => {
          console.error("일정 수정 실패:", err);
        });
    } else {
      // 신규 등록
      createSchedule({ ...payload })
        .then((res) => {
          const created = {
            ...res.data,
            id: res.data.scheduleId,
          };
          setSchedules((prev) => [...prev, created]);
        })
        .catch((err) => {
          console.error("일정 추가 실패:", err);
        });
    }

    setShowForm(false);
    setEditingSchedule(null);
  };

  return (
    <div
      className="calendar-container"
      style={{ "--calendar-width": `${DEFAULT_SIZE}px` }}
    >
      <div className="calendar-nav">
        <i
          className="prev bx bx-caret-left"
          onClick={() => handleNavigationClick(-1)}
        ></i>
        <div className="calendar-title">
          <div className="month">{monthNames[currentMonth]}</div>
          <div className="year">{currentYear}</div>
        </div>
        <i
          className="next bx bx-caret-right"
          onClick={() => handleNavigationClick(1)}
        ></i>
      </div>

      <div className="calendar-grid">
        {dayNames.map((dayName) => (
          <div key={dayName} className="day">
            {dayName}
          </div>
        ))}
        {eachCalendarDates().map((date) => (
          <div
            key={formattedDate(date)}
            data-date={formattedDate(date)}
            className="day-box"
            onClick={() => handleDateClick(date)}
          >
            <div className={`${classNames(date)} date-text`}>
              {date.getDate()}
            </div>
            <div className="todo-container">
              {schedules
                .filter(
                  (s) =>
                    s.startDate <= formattedDate(date) &&
                    s.endDate >= formattedDate(date)
                )
                .map((s, idx) => (
                  <div
                    key={idx}
                    className="todo-list"
                    style={{
                      background: s.color,
                      color: "#fff",
                      padding: "2px 4px",
                      borderRadius: "4px",
                      margin: "2px 0",
                      fontSize: "0.8em",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
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

      {/* 일정 추가 폼 모달 */}
      {showForm && (
        <ScheduleForm
          initialDate={selectedDate}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
          schedule={editingSchedule}
        />
      )}

      {/* 일정 상세 모달 */}
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
