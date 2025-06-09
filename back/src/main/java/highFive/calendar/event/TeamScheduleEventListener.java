package highFive.calendar.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

import highFive.calendar.dto.TeamScheduleDto;
import highFive.calendar.entity.TeamSchedule;

import org.springframework.transaction.event.TransactionPhase;

@Component
public class TeamScheduleEventListener {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleTeamScheduleCreatedEvent(TeamScheduleCreatedEvent event) {
        TeamSchedule teamSchedule = event.getTeamSchedule();

        // DTO로 변환
        TeamScheduleDto dto = TeamScheduleDto.builder()
                .teamScheduleId(teamSchedule.getTeamScheduleId())
                .teamId(teamSchedule.getTeam().getTeamId())
                .userId(teamSchedule.getUser() != null ? teamSchedule.getUser().getUserId() : null)
                .userName(teamSchedule.getUser() != null ? teamSchedule.getUser().getName() : null)
                .title(teamSchedule.getTitle())
                .description(teamSchedule.getDescription())
                .color(teamSchedule.getColor())
                .startDate(teamSchedule.getStartDate())
                .endDate(teamSchedule.getEndDate())
                .build();

        messagingTemplate.convertAndSend("/topic/team/" + dto.getTeamId(), dto);

        System.out.println("[WebSocket] 일정 생성 알림 전송 완료");
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleTeamScheduleUpdatedEvent(TeamScheduleUpdatedEvent event) {
        TeamSchedule teamSchedule = event.getTeamSchedule();

        TeamScheduleDto dto = TeamScheduleDto.builder()
                .teamScheduleId(teamSchedule.getTeamScheduleId())
                .teamId(teamSchedule.getTeam().getTeamId())
                .userId(teamSchedule.getUser() != null ? teamSchedule.getUser().getUserId() : null)
                .userName(teamSchedule.getUser() != null ? teamSchedule.getUser().getName() : null)
                .title(teamSchedule.getTitle())
                .description(teamSchedule.getDescription())
                .color(teamSchedule.getColor())
                .startDate(teamSchedule.getStartDate())
                .endDate(teamSchedule.getEndDate())
                .type("update")
                .build();

        messagingTemplate.convertAndSend("/topic/team/" + dto.getTeamId(), dto);
        System.out.println("[WebSocket] 일정 수정 알림 전송 완료");
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleTeamScheduleDeletedEvent(TeamScheduleDeletedEvent event) {
        TeamScheduleDto dto = TeamScheduleDto.builder()
                .teamScheduleId(event.getTeamScheduleId())
                .teamId(event.getTeamId())
                .type("delete")
                .build();

        messagingTemplate.convertAndSend("/topic/team/" + dto.getTeamId(), dto);
        System.out.println("[WebSocket] 일정 삭제 알림 전송 완료");
    }
}
