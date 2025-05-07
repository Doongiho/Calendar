package highFive.calendar.repository;



import highFive.calendar.entity.Team;
import highFive.calendar.entity.TeamMember;
import highFive.calendar.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    List<TeamMember> findByTeam(Team team); // 팀에 속한 모든 것 -> 팀 상세 페이지
    List<TeamMember> findByUser(User user); // 유저가 속한 모든 팀 정보 -> 팀 목록

    Optional<TeamMember> findByTeamAndUser(Team team, User user); // 특정 팀에 특정 유저 있는지 확인 -> 팀 중복 방지
    boolean existsByTeam_TeamIdAndUser_UserId(Long teamId, Long userId); // 특정 팀 ID와 사용자 ID로 멤버 존재 여부 확인 (boolean 반환)
}
