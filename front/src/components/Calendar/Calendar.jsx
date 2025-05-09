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
          console.log("불러온 일정 목록:", res.data);
          const formatted = res.data.map((s) => ({
            ...s,
            startDate: s.startDateTime?.split("T")[0],
            endDate: s.endDateTime?.split("T")[0],
          }));
          setSchedules(formatted);
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
    setSchedules(schedules.filter((s) => s.id !== scheduleToDelete.id));
    setSelectedSchedule(null);
  };

  const handleFormSubmit = (schedule) => {
    if (schedule.id) {
      setSchedules((prevSchedules) =>
        prevSchedules.map((s) => (s.id === schedule.id ? schedule : s))
      );
    } else {
      setSchedules((prevSchedules) => [
        ...prevSchedules,
        { ...schedule, id: Date.now() },
      ]);
    }
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
