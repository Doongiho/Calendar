package highFive.calendar.service;

import highFive.calendar.entity.Team;
import highFive.calendar.entity.TeamSchedule;
import highFive.calendar.entity.User;
import highFive.calendar.event.TeamScheduleCreatedEvent;
import highFive.calendar.event.TeamScheduleDeletedEvent;
import highFive.calendar.event.TeamScheduleUpdatedEvent;
import highFive.calendar.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
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

    // WebSocket 메시지 전송을 위한 템플릿 → 서비스에서 직접 쓰지 않고 이벤트로 대체
    // @Autowired
    // private SimpMessagingTemplate messagingTemplate;

    // 이벤트 발행용 ApplicationEventPublisher 추가
    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Transactional
    public TeamSchedule createTeamSchedule(TeamSchedule teamSchedule) {
        System.out.println("createTeamSchedule 시작");
        Team team = teamRepository.findById(teamSchedule.getTeam().getTeamId())
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

        User user = userRepository.findById(teamSchedule.getUser().getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (teamMemberRepository.findByTeamAndUser(team, user).isEmpty()) {
            throw new IllegalArgumentException("팀에 속하지 않습니다.");
        }

        TeamSchedule savedSchedule = teamScheduleRepository.save(teamSchedule);

        // 기존 messagingTemplate.convertAndSend 부분 삭제하고 이벤트 발행으로 대체
        eventPublisher.publishEvent(new TeamScheduleCreatedEvent(savedSchedule));
        System.out.println("[Event] TeamScheduleCreatedEvent 발행됨");

        return savedSchedule;
    }

    // 팀 스케줄 조회 (전체)
    public List<TeamSchedule> getTeamSchedulesByTeam(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

        return teamScheduleRepository.findByTeam(team);
    }

    // 팀 스케줄 조회 (단일?)
    public Optional<TeamSchedule> getTeamScheduleById(Long teamScheduleId) {
        return teamScheduleRepository.findById(teamScheduleId);
    }

    // 팀 스케줄 수정
    @Transactional
    public TeamSchedule updateTeamSchedule(TeamSchedule teamSchedule) {
        if (!teamScheduleRepository.existsById(teamSchedule.getTeamScheduleId())) {
            throw new IllegalArgumentException("Team schedule not found");
        }

        TeamSchedule updated = teamScheduleRepository.save(teamSchedule);

        eventPublisher.publishEvent(new TeamScheduleUpdatedEvent(updated));
        return updated;
    }

    // 팀 스케줄 삭제
    @Transactional
    public void deleteTeamSchedule(Long teamScheduleId) {
        TeamSchedule teamSchedule = teamScheduleRepository.findById(teamScheduleId)
                .orElseThrow(() -> new IllegalArgumentException("Team Schedule not found"));

        teamScheduleRepository.deleteById(teamScheduleId);

        eventPublisher.publishEvent(new TeamScheduleDeletedEvent(teamScheduleId, teamSchedule.getTeam().getTeamId()));
    }
}
