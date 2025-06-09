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
  deleteTeamSchedule,
} from "../../api/teamScheduleApi";
import { fetchTeamMembers } from "../../api/teamApi";
import { useUser } from "../../contexts/UserContext";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useRef } from "react";
const Calendar = ({ onDateSelect, teamId }) => {
  const { user } = useUser();
  const userId = user?.userId;
  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월",
  ];
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const stompClient = useRef(null);
  useEffect(() => {
    if (teamId) {
      fetchTeamSchedules(teamId)
        .then((res) => {
          const withIds = res.data.map((s) => ({
            ...s,
            id: s.teamScheduleId,
          }));
          setSchedules(withIds);
          connectWebSocketForTeam(teamId);  // 팀 일정 WebSocket 연결
        })
        .catch((err) => console.error("팀 일정 로드 실패:", err));

      fetchTeamMembers(teamId).then((res) =>
        setTeamMembers(res.data || res)
      );
    } else if (userId) {
      fetchUserSchedules(userId)
        .then((res) => {
          const withIds = res.data.map((s) => ({
            ...s,
            id: s.scheduleId,
          }));
          setSchedules(withIds);
          connectWebSocketForUser(userId);  // **개인 일정 WebSocket 연결 추가**
        })
        .catch((err) => console.error("개인 일정 로드 실패:", err));
    }

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
        stompClient.current = null;
      }
    };
  }, [userId, teamId]);


  // JWT 토큰 가져오는 헬퍼
  function getToken() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { token } = JSON.parse(storedUser);
      // 'Bearer ' 접두어 제거
      if (token?.startsWith("Bearer ")) {
        return token.slice(7);
      }
      return token;
    }
    return null;
  }


  // 팀용 WebSocket 연결 함수
  function connectWebSocketForTeam(teamId) {
    if (stompClient.current && stompClient.current.active) return;

    const token = getToken();
    const socket = new SockJS(`http://localhost:8080/ws?token=${encodeURIComponent(token)}`);

    stompClient.current = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { token },  // 제거 가능
      debug: (str) => {
        console.log(str);  // 디버깅 위해 주석 해제 추천
      },
      onConnect: () => {
        console.log("WebSocket connected for team:", teamId);
        // stompClient.current.subscribe(`/topic/team/${teamId}`, (message) => {
        //   if (message.body) {
        //     const { type, payload } = JSON.parse(message.body);

        //     setSchedules((prev) => {
        //       const id = payload.teamScheduleId;
        //       switch (type) {
        //         case "created":
        //         case "updated":
        //           const exists = prev.some((s) => s.id === id);
        //           const updated = { ...payload, id };
        //           return exists
        //             ? prev.map((s) => (s.id === id ? updated : s))
        //             : [...prev, updated];

        //         case "deleted":
        //           return prev.filter((s) => s.id !== id);

        //         default:
        //           console.warn("알 수 없는 WebSocket 메시지 타입:", type);
        //           return prev;
        //       }
        //     });
        //   }
        // });
        stompClient.current.subscribe(`/topic/team/${teamId}`, (message) => {
          if (message.body) {
            const updatedSchedule = JSON.parse(message.body);
            setSchedules((prev) => {
              const exists = prev.some((s) => s.id === updatedSchedule.teamScheduleId);
              if (exists) {
                return prev.map((s) =>
                  s.id === updatedSchedule.teamScheduleId
                    ? { ...updatedSchedule, id: updatedSchedule.teamScheduleId }
                    : s
                );
              } else {
                return [...prev, { ...updatedSchedule, id: updatedSchedule.teamScheduleId }];
              }
            });
          }
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
      },
    });

    stompClient.current.activate();
  }
  function connectWebSocketForUser(userId) {
    if (stompClient.current && stompClient.current.active) return;

    const token = getToken();
    const socket = new SockJS(`http://localhost:8080/ws?token=${encodeURIComponent(token)}`);

    stompClient.current = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { token },
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        console.log("WebSocket connected for user:", userId);

        // 개인 일정용 구독
        stompClient.current.subscribe(`/user/queue/schedule`, (message) => {
          if (message.body) {
            const msg = JSON.parse(message.body);

            // 메시지에 type이 없으면 기본 created로 간주
            const type = msg.type || "created";
            const payload = msg.payload || msg; // 기존 호환용

            const id = payload.scheduleId;

            setSchedules((prev) => {
              if (type === "deleted") {
                // 삭제면 배열에서 제거
                return prev.filter((s) => s.id !== id);
              } else {
                // created/updated면 있으면 덮어쓰기, 없으면 추가
                const exists = prev.some((s) => s.id === id);
                if (exists) {
                  return prev.map((s) =>
                    s.id === id ? { ...payload, id } : s
                  );
                } else {
                  return [...prev, { ...payload, id }];
                }
              }
            });
          }
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
      },
    });

    stompClient.current.activate();
  }



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
    const id = schedule.id || schedule.scheduleId || schedule.teamScheduleId;

    if (!id) {
      alert("삭제할 일정 ID가 없습니다.");
      return;
    }

    const deleteFn =
      teamId || schedule.teamScheduleId ? deleteTeamSchedule : deleteSchedule;

    deleteFn(id)
      .then(() => {
        setSchedules((prev) =>
          prev.filter((s) => {
            const sId = s.id || s.scheduleId || s.teamScheduleId;
            return sId !== id;
          })
        );
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

    const updateFn = teamId ? updateTeamSchedule : updateSchedule;
    const createFn = teamId ? createTeamSchedule : createSchedule;

    if (schedule.scheduleId || schedule.teamScheduleId) {
      const id = schedule.scheduleId || schedule.teamScheduleId;
      updateFn(id, payload).then((res) => {
        const updated = {
          ...res.data,
          id: res.data.scheduleId || res.data.teamScheduleId,
          startDate: res.data.startDate.slice(0, 10),
          endDate: res.data.endDate.slice(0, 10),
        };
        setSchedules((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s))
        );
        setEditingSchedule(null);  // 수정 완료 후 초기화
        setShowForm(false);         // 폼 닫기 (선택 사항)
      });
    } else {
      createFn(payload).then(() => {
        // ✅ WebSocket 통해서 일정이 추가되므로 setSchedules 하지 않음
      });
    }
  };

  return (
    <div className={`calendar-container ${teamId ? "team-mode" : ""}`}>
      <div className="calendar-nav">
        <i className="prev bx bx-chevron-left" onClick={() => handleNavigationClick(-1)}></i>
        <div className="calendar-title">
          <h2>
            {currentYear}년 {monthNames[currentMonth]}
          </h2>
        </div>
        <i className="next bx bx-chevron-right" onClick={() => handleNavigationClick(1)}></i>
      </div>

      <div className="calendar-grid">
        {dayNames.map((dayName) => (
          <div key={dayName} className="day-header">
            {dayName}
          </div>
        ))}
        {eachCalendarDates().map((date) => (
          <div
            key={formattedDate(date)}
            className={`day-cell ${classNames(date)}`}
            onClick={() => handleDateClick(date)}
          >
            <div className="date-number">{date.getDate()}</div>
            <div className="todo-list-wrap">
              {schedules
                .filter(
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
          teamId={teamId}
          memberMap={
            teamId
              ? teamMembers.reduce((acc, user) => {
                acc[user.userId] = user.userName;
                return acc;
              }, {})
              : undefined
          }
        />
      )}
    </div>
  );
};

export default Calendar;