import CreateTeamModal from "components/CreateTeamModal/CreateTeamModal";
import EditTeamModal from "components/EditTeamModal/EditTeamModal";
import InviteModal from "components/InviteModal/InviteModal";
import EditProfile from "pages/EditProfile/EditProfile";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  acceptInvitation,
  fetchPendingInvitations,
  rejectInvitation,
} from "../../api/invitationApi";
import {
  createTeam,
  deleteTeam,
  fetchTeamsByUser,
  updateTeam,
} from "../../api/teamApi";
import { deleteUser } from "../../api/userApi";
import { useUser } from "../../contexts/UserContext";
import "./Header.css";

export default function Header() {
  const { user, setUser } = useUser();
  const userName = user?.name || "사용자";
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [inviteTeam, setInviteTeam] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [showInvitations, setShowInvitations] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (!user?.userId) return;

    const initializeData = async () => {
      try {
        const [teamsRes, invitationsRes] = await Promise.all([
          fetchTeamsByUser(user.userId),
          fetchPendingInvitations(user.userId),
        ]);
        setTeams(teamsRes);
        setInvitations(invitationsRes);
      } catch (err) {
        console.error("초기 데이터 불러오기 실패", err);
        setTeams([]);
        setInvitations([]);
      }
    };

    initializeData();
  }, [user?.userId]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleWithdraw = async () => {
    if (window.confirm("정말 탈퇴하시겠습니까?")) {
      try {
        await deleteUser(user.userId);
        alert("회원 탈퇴가 완료되었습니다.");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
      } catch (error) {
        console.error("회원 탈퇴 실패:", error);
        alert("회원 탈퇴 중 문제가 발생했습니다.");
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
    setShowInvitations(false);
  };

  const handleAlarmClick = async () => {
    if (!user?.userId) return;

    try {
      const pending = await fetchPendingInvitations(user.userId);
      setInvitations(pending);
    } catch (err) {
      console.error("초대 목록 오류", err);
      setInvitations([]);
    }

    setShowInvitations((prev) => !prev);
  };

  const handleRespond = async (invitationId, action) => {
    try {
      if (action === "ACCEPTED") {
        await acceptInvitation(user.userId, invitationId);
      } else {
        await rejectInvitation(user.userId, invitationId);
      }

      const updated = await fetchPendingInvitations(user.userId);
      setInvitations(updated);

      const updatedTeams = await fetchTeamsByUser(user.userId);
      setTeams(updatedTeams);

      alert(`초대를 ${action === "ACCEPTED" ? "수락" : "거절"}했습니다.`);
    } catch (err) {
      console.error("응답 오류", err);
      alert("응답 처리 중 오류가 발생했습니다.");
    }
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
      if (!newTeam?.teamId) throw new Error("팀 생성 실패");
      const updatedTeams = await fetchTeamsByUser(user.userId);
      setTeams(updatedTeams);
      setShowCreateTeamModal(false);
    } catch (error) {
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
            <div className="alarm" onClick={handleAlarmClick}>
              <span className="material-symbols-outlined">notifications</span>
              {invitations.length > 0 && (
                <span className="badge">{invitations.length}</span>
              )}
            </div>
            <div className="mypage-box">
              <div className="mypage" onClick={handleUserMenuToggle}>
                <span className="material-symbols-outlined">
                  account_circle
                </span>
              </div>
            </div>
            <div className="room" onClick={handleMenuToggle}>
              <span className="material-symbols-outlined">menu</span>
            </div>
          </div>

          {userMenuOpen && (
            <div className="dropdown-menu" ref={userMenuRef}>
              <button onClick={() => setShowEditModal(true)}>
                회원정보 수정
              </button>
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
              setInvitations={setInvitations}
            />
          )}

          {showInvitations && (
            <div className="dropdown-menu" ref={userMenuRef}>
              <div className="room-list-title">받은 초대</div>
              <ul className="room-list">
                {invitations.length === 0 ? (
                  <li className="room-item muted">초대가 없습니다</li>
                ) : (
                  invitations.map((inv) => (
                    <li key={inv.invitationId} className="room-item">
                      <span>{inv.teamName}</span>
                      <div className="group-btn">
                        <button
                          className="accepted-btn"
                          onClick={() =>
                            handleRespond(inv.invitationId, "ACCEPTED")
                          }
                        >
                          수락
                        </button>
                        <button
                          className="rejected-btn"
                          onClick={() =>
                            handleRespond(inv.invitationId, "REJECTED")
                          }
                        >
                          거절
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {menuOpen && (
            <div className="dropdown-menu" ref={menuRef}>
              <div className="room-list-title">팀 캘린더 목록</div>
              <ul className="room-list">
                {teams.length > 0 ? (
                  teams
                    .filter(
                      (team) =>
                        team.userId === user.userId ||
                        team.invitationStatus?.toUpperCase() === "ACCEPTED"
                    )
                    .sort((a, b) =>
                      a.userId === user.userId && b.userId !== user.userId
                        ? -1
                        : a.userId !== user.userId && b.userId === user.userId
                        ? 1
                        : a.teamName.localeCompare(b.teamName)
                    )
                    .map((team) => (
                      <li key={team.teamId} className="room-item">
                        <span
                          className="team-name"
                          title={team.teamName}
                          onClick={() => navigate(`/teams/${team.teamId}`)}
                        >
                          {team.teamName}
                        </span>
                        {team.userId !== user.userId && (
                          <span className="badge">팀원</span>
                        )}
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
                className="create-room-button"
                onClick={() => setShowCreateTeamModal(true)}
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
