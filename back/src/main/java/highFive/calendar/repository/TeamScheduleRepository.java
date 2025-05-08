package highFive.calendar.repository;

import highFive.calendar.entity.Team;
import highFive.calendar.entity.TeamSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TeamScheduleRepository extends JpaRepository<TeamSchedule, Long> {
    List<TeamSchedule> findByTeam(Team team); // 팀 전체 일정 불러오기
}
