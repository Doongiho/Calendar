import React from "react";
import Calendar from "../../components/Calendar/Calendar";
import Header from "pages/Header/Header";
import "./MyCalendar.css"

export default function MyCalendar() {

  return (
    <div className="calendardiv">
      <Header/>
      <Calendar/>
    </div>
  )
}