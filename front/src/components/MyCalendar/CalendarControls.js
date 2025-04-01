import React, { useState, useEffect } from 'react';

const CalendarControls = ({ calendarRef }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const updateCurrentDate = () => {
    const instance = calendarRef.current.getInstance();
    const newDate = instance.getDate();
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    calendarRef.current.getInstance().next();
    updateCurrentDate();
  };

  const handlePrev = () => {
    calendarRef.current.getInstance().prev();
    updateCurrentDate();
  };

  const handleToday = () => {
    calendarRef.current.getInstance().today();
    updateCurrentDate();
  };

  useEffect(() => {
    // 초기 날짜 설정
    updateCurrentDate();
  }, []);

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* 현재 월과 년도 표시 */}
      <h2>
        {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
      </h2>
      <button onClick={handlePrev}>이전</button>
      <button onClick={handleToday}>오늘</button>
      <button onClick={handleNext}>다음</button>
    </div>
  );
};

export default CalendarControls;
