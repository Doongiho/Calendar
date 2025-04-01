import React, { createRef, useEffect } from 'react';
import Calendar from '@toast-ui/react-calendar';
import 'tui-calendar/dist/tui-calendar.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';
import 'react-calendar/dist/Calendar.css';


import CalendarControls from './CalendarControls';

const MyCalendar = () => {
  const calendarRef = createRef();

  useEffect(() => {
    const styleTag = document.createElement('style');
    document.head.appendChild(styleTag);

    return () => document.head.removeChild(styleTag);
  }, []);

  return (
    <div>
      <CalendarControls calendarRef={calendarRef} />
      
      <Calendar
        ref={calendarRef}
        height="800px"
        view="month"
      />
    </div>
  );
};

export default MyCalendar;