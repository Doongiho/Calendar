package highFive.calendar.repository;


import highFive.calendar.entity.Invitation;
import highFive.calendar.entity.Team;
import highFive.calendar.entity.User;
import highFive.calendar.enums.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    List<Invitation> findByInvitedUser (User user); // 특정 유저에게 온 모든 초대 조회
    List<Invitation> findByInvitedUserAndStatus(User invitedUser, InvitationStatus status); // 특정 사용자가 받은 모든 초대 조회 (초대 상태별로 필터링 가능하도록)
    Optional<Invitation> findByTeamAndInvitedUserAndStatus(Team team, User invitedUser, InvitationStatus status); // 특정 팀으로 특정 사용자를 초대한 특정 상태의 내역이 있는지 확인
}
