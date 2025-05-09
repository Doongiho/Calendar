import React from "react";
import { useParams } from "react-router-dom";
import Calendar from "../../components/Calendar/Calendar";
import Header from "pages/Header/Header";
import "./MyCalendar.css";

export default function MyCalendar() {
  const { userId } = useParams();

  return (
    <div className="calendardiv">
      <Header />
      <Calendar userId={userId} />
    </div>
  );
}
