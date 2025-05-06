import React, { useState } from 'react';
import './Header.css';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, setUser } = useUser();
  const userName = user?.name || '사용자';
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem('user'); // 자동 로그인 해제
    setUser(null); // 전역 상태 초기화
    navigate('/'); // 로그인 페이지로 이동
  };

  const goToEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleWithdraw = async () => {
    if (window.confirm('정말 탈퇴하시겠습니까?')) {
      try {
        await deleteUser(user.userId); // 서버에 삭제 요청
        alert('회원 탈퇴가 완료되었습니다.');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
      } catch (error) {
        console.error('회원 탈퇴 실패:', error);
        alert('회원 탈퇴 중 문제가 발생했습니다.');
      }
    }
  };

  return (
    <>
      <header>
        {/* 모바일 버전 */}
        <div className="mo-header">
          <div className="mobile-title">{userName}님의 개인 일정표</div>
          <div className="mobile-submenu submenu">
            <div className="mo-room" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="material-symbols-outlined">menu</span>
            </div>
            {menuOpen && (
              <div className="dropdown-menu">
                <button onClick={goToEditProfile}>회원정보 수정</button>
                <button onClick={handleLogout}>로그아웃</button>
                <button onClick={handleWithdraw}>회원탈퇴</button>
              </div>
            )}
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
            <div className="room" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="material-symbols-outlined">menu</span>
              {menuOpen && (
                <div className="dropdown-menu">
                  <button onClick={goToEditProfile}>회원정보 수정</button>
                  <button onClick={handleLogout}>로그아웃</button>
                  <button onClick={handleWithdraw}>회원탈퇴</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
