import React, { useState } from 'react';
import './Calendar.css'; 

const Calendar = ({ onDateSelect }) => {
  const DEFAULT_SIZE =  window.innerWidth; 
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const [currentDate, setCurrentDate] = useState(new Date());
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const formattedDate = (date) => {
    const format = (n) => (n < 10 ? `0${n}` : `${n}`);
    return `${date.getFullYear()}-${format(date.getMonth() + 1)}-${format(date.getDate())}`;
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

    if (isEqualDate(date, today)) classes.push('today');
    if (date.getMonth() !== currentMonth) classes.push('muted');
    if (date.getDay() === 0) classes.push('sunday');

    return classes.join(' ');
  };

  const handleNavigationClick = (delta) => {
    setCurrentDate(new Date(currentYear, currentMonth + delta));
  };

  const handleDateClick = (date) => {
    onDateSelect?.(formattedDate(date)); 
  };

  return (
    <div className="calendar-container" style={{ '--calendar-width': `${DEFAULT_SIZE}px` }}>
      <div className="calendar-nav">
        <i className="prev bx bx-caret-left" onClick={() => handleNavigationClick(-1)}></i>
        <div className="calendar-title">
          <div className="month">{monthNames[currentMonth]}</div>
          <div className="year">{currentYear}</div>
        </div>
        <i className="next bx bx-caret-right" onClick={() => handleNavigationClick(1)}></i>
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
            className={`day-box`}
            onClick={() => handleDateClick(date)}
        >
            <div 
                className={`${classNames(date)} date-text`}
            > 
                {date.getDate()}
            </div>
            <div className="todo-container">
                {/* <div className="todo-list" data-date={formattedDate(date)}>
                    sss
                </div>
                    <div className="todo-list" data-date={formattedDate(date)}>
                    sss
                </div> */}
            </div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
