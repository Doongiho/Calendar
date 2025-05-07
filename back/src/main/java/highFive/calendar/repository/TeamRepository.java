package highFive.calendar.repository;

import highFive.calendar.entity.Team;
import highFive.calendar.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByUser(User user); // 특정 유저의 팀 목록 조회
}
