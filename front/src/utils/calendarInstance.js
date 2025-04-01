// calendarInstance.js
import { createRef } from 'react';

const calendarRef = createRef();

const calendarInstance = {
  next() {
    calendarRef.current.getInstance().next();
  },
  prev() {
    calendarRef.current.getInstance().prev();
  },
  today() {
    calendarRef.current.getInstance().today();
  },
  getCurrentDate() {
    return calendarRef.current.getInstance().getDate();
  },
};

export { calendarRef, calendarInstance };
