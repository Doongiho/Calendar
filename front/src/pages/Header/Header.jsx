import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from "../../api/userApi";
import { fetchTeamsByUser, createTeam, deleteTeam, updateTeam } from "../../api/teamApi";
import EditProfile from 'pages/EditProfile/EditProfile';
import CreateTeamModal from 'components/CreateTeamModal/CreateTeamModal';
import EditTeamModal  from 'components/EditTeamModal/EditTeamModal'
import InviteModal from 'components/InviteModal/InviteModal';

export default function Header() {
  const { user, setUser } = useUser();
  const userName = user?.name || '사용자';
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [inviteTeam, setInviteTeam] = useState(null); 

  const navigate = useNavigate();

  const menuRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ 새로고침 시 자동 팀 불러오기
  useEffect(() => {
    if (user?.userId) {
      fetchTeamsByUser(user.userId)
        .then(setTeams)
        .catch(() => setTeams([]));
    }
  }, [user?.userId]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleWithdraw = async () => {
    if (window.confirm('정말 탈퇴하시겠습니까?')) {
      try {
        await deleteUser(user.userId);
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

  const handleMenuToggle = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    setUserMenuOpen(false);
    if (next && user?.userId) {
      fetchTeamsByUser(user.userId)
        .then(setTeams)
        .catch(() => setTeams([]));
    }
  };

  const handleUserMenuToggle = () => {
    setUserMenuOpen(!userMenuOpen);
    setMenuOpen(false);
  };

  const handleCreateTeam = async ({ teamName, description }) => {
    if (!user || !user.token) {
      alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
      return;
    }

    try {
      const newTeam = await createTeam({
        userId: user.userId,
        teamName,
        description,
      });

      if (!newTeam || !newTeam.teamId) {
        throw new Error("생성된 팀의 ID가 없습니다.");
      }

      console.log("생성된 team:", newTeam);

      const updatedTeams = await fetchTeamsByUser(user.userId);
      setTeams(updatedTeams);
      setShowCreateTeamModal(false);
    } catch (error) {
      console.error("팀 생성 실패:", error);
      alert("팀 생성 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm("정말 이 팀을 삭제하시겠습니까?")) {
      try {
        await deleteTeam(teamId);
        setTeams((prev) => prev.filter((team) => team.teamId !== teamId));
        alert("팀이 삭제되었습니다.");
      } catch (error) {
        console.error("팀 삭제 실패:", error);
        alert("팀 삭제 중 문제가 발생했습니다.");
      }
    }
  };

  const handleUpdateTeam = async ({ teamId, teamName, description }) => {
    try {
      await updateTeam(teamId, { teamName, description });
      const updatedTeams = await fetchTeamsByUser(user.userId);
      setTeams(updatedTeams);
      setShowEditTeamModal(false);
      alert("팀이 수정되었습니다.");
    } catch (error) {
      console.error("팀 수정 실패:", error);
      alert("팀 수정 중 오류가 발생했습니다.");
    }
  };
  
  
  return (
    <>
      {showEditModal && <EditProfile onClose={() => setShowEditModal(false)} />}
      {showCreateTeamModal && (
        <CreateTeamModal
          onClose={() => setShowCreateTeamModal(false)}
          onCreate={handleCreateTeam}
        />
      )}

      <header>
        <div className="mo-header">
          <div className="mobile-title">{userName}님의 개인 일정표</div>
          <div className="mobile-submenu submenu">
            <div className="mo-room">
              <span className="material-symbols-outlined">menu</span>
            </div>
          </div>
        </div>

        <div className="pc-header">
          <div className="mobile-title">{userName}님의 개인 일정표</div>
          <div className="pc-submenu submenu">
            <div className="alarm">
              <span className="material-symbols-outlined">notifications</span>
            </div>
            <div className="mypage-box">
              <div className="mypage" onClick={handleUserMenuToggle}>
                <span className="material-symbols-outlined">account_circle</span>
              </div>
            </div>
            <div className="room" onClick={handleMenuToggle}>
              <span className="material-symbols-outlined">menu</span>
            </div>
          </div>

          {userMenuOpen && (
            <div className="dropdown-menu" ref={userMenuRef}>
              <button onClick={() => setShowEditModal(true)}>회원정보 수정</button>
              <button onClick={handleLogout}>로그아웃</button>
              <button onClick={handleWithdraw}>회원탈퇴</button>
            </div>
          )}

          {showEditTeamModal && selectedTeam && (
            <EditTeamModal
              team={selectedTeam}
              onClose={() => setShowEditTeamModal(false)}
              onUpdate={handleUpdateTeam}
            />
          )}

          {inviteTeam && (
            <InviteModal
              team={inviteTeam}
              onClose={() => setInviteTeam(null)}
            />
          )}

          {menuOpen && (
            <div className="dropdown-menu" ref={menuRef}>
              <div className="room-list-title">팀 캘린더 목록</div>

              <ul className="room-list">
                {Array.isArray(teams) && teams.length > 0 ? (
                  [...teams]
                    .filter((team) => {
                      // 방장이거나 수락한 팀만 표시
                      return (
                        team.userId === user.userId ||
                        (team.invitationStatus &&
                          team.invitationStatus.toUpperCase() === "ACCEPTED")
                      );
                    })
                    .sort((a, b) => {
                      if (a.userId === user.userId && b.userId !== user.userId) return -1;
                      if (a.userId !== user.userId && b.userId === user.userId) return 1;
                      return a.teamName.localeCompare(b.teamName);
                    })
                    .map((team) => (
                      <li key={team.teamId} className="room-item">
                        <span
                          className="team-name"
                          title={team.teamName}
                          onClick={() => navigate(`/teams/${team.teamId}`)}
                        >
                          {team.teamName}
                        </span>
                        {/* 팀원 뱃지 */}
                        {team.userId !== user.userId && (
                          <span className="badge" title="팀 관리 권한 없음">팀원</span>
                        )}

                        {/* 방장만 관리 버튼 표시 */}
                        {team.userId === user.userId && (
                          <div className="group-btn">
                            <button
                              className="invite-btn-list"
                              onClick={() => setInviteTeam(team)}
                            >
                              초대
                            </button>
                            <button
                              className="edit-btn-list"
                              onClick={() => {
                                setSelectedTeam(team);
                                setShowEditTeamModal(true);
                              }}
                            >
                              수정
                            </button>
                            <button
                              className="delete-btn-list"
                              onClick={() => handleDeleteTeam(team.teamId)}
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </li>
                    ))
                ) : (
                  <li className="room-item muted">팀이 없습니다</li>
                )}
              </ul>
              <button
                onClick={() => setShowCreateTeamModal(true)}
                className="create-room-button"
              >
                팀 방 만들기
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
