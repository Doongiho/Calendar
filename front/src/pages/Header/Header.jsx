import React from "react";
import "./Header.css";
import { useUser } from "../../contexts/UserContext";

export default function Header() {
  const { user } = useUser();
  const userName = user?.name || "사용자";
  return (
    <>
      <header>
        {/* 모바일 버전 */}
        <div className="mo-header">
           <div className="mobile-title">{userName}님의 개인 일정표</div>
          <div className="mobile-submenu submenu">
            <div className="mo-room">
              <span className="material-symbols-outlined">menu</span>
            </div>
          </div>
        </div>
        {/* PC 버전 */}
        <div className="pc-header"> 
           <div className="mobile-title">{userName}님의 개인 일정표</div>
          <div className="pc-submenu submenu">
            <div className="alarm">
              <span className="material-symbols-outlined">notifications</span>
            </div>
            <div className="mypage">
              <span className="material-symbols-outlined">account_circle</span>
            </div>
            <div className="room">
              <span className="material-symbols-outlined">menu</span>
            </div>
        </div>
        </div>
      </header>
    </>
  );
}
