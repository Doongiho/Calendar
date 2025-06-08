import React from "react";
import { useParams } from "react-router-dom";
import Calendar from "../../components/Calendar/Calendar";
import Header from "pages/Header/Header";
import "./MyCalendar.css"; 

export default function TeamCalendar() {
  const { teamId } = useParams();

  return (
    <div className="calendardiv">
      <Header /> 
      <Calendar teamId={teamId} />
    </div>
  );
}

