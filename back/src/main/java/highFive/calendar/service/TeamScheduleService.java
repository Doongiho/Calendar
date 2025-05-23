package highFive.calendar.service;

import highFive.calendar.entity.Team;
import highFive.calendar.entity.TeamSchedule;
import highFive.calendar.entity.User;
import highFive.calendar.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TeamScheduleService {

    @Autowired
    private TeamScheduleRepository teamScheduleRepository;
    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TeamMemberRepository teamMemberRepository;
    @Autowired
    private InvitationRepository invitationRepository;

    //  팀 스케줄 생성
    @Transactional
    public TeamSchedule createTeamSchedule(TeamSchedule teamSchedule) {
        Team team = teamRepository.findById(teamSchedule.getTeam().getTeamId())
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

        User user = userRepository.findById(teamSchedule.getUser().getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (teamMemberRepository.findByTeamAndUser(team, user).isEmpty()) {
            throw new IllegalArgumentException("팀에 속하지 않습니다.");
        }

        return teamScheduleRepository.save(teamSchedule);
    }

    //  팀 스케줄 조회 (전체)
    public List<TeamSchedule> getTeamSchedulesByTeam(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

        return teamScheduleRepository.findByTeam(team);
    }

    //  팀 스케줄 조회 (단일?)
    public Optional<TeamSchedule> getTeamScheduleById(Long teamScheduleId) {
        return teamScheduleRepository.findById(teamScheduleId);
    }

    //  팀 스케줄 수정
    @Transactional
    public TeamSchedule updateTeamSchedule(TeamSchedule teamSchedule) {
        if (!teamScheduleRepository.existsById(teamSchedule.getTeamScheduleId())) {
            throw new IllegalArgumentException("Team schedule not found");
        }

        return teamScheduleRepository.save(teamSchedule);
    }

    //  팀 스케줄 삭제
    @Transactional
    public void deleteTeamSchedule(Long teamScheduleId) {
        TeamSchedule teamSchedule = teamScheduleRepository.findById(teamScheduleId)
                .orElseThrow(() -> new IllegalArgumentException("Team Schedule not found"));

        teamScheduleRepository.deleteById(teamScheduleId);
    }
}
