package highFive.calendar.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

import highFive.calendar.dto.ScheduleDto;
import highFive.calendar.entity.Schedule;

@Component
public class ScheduleEventListener {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleScheduleCreateEvent(ScheduleCreateEvent event) {
        Schedule schedule = event.getSchedule();

        // 직접 DTO 빌드 (필드 하나하나 세팅)
        ScheduleDto dto = ScheduleDto.builder()
                .scheduleId(schedule.getScheduleId())
                .userId(schedule.getUser().getUserId())
                .title(schedule.getTitle())
                .description(schedule.getDescription())
                .startDate(schedule.getStartDate())
                .endDate(schedule.getEndDate())
                .color(schedule.getColor())
                .build();

        messagingTemplate.convertAndSendToUser(
                schedule.getUser().getEmail(),  // Principal로 이메일 쓰는 경우
                "/queue/schedule",
                dto
        );
        System.out.println("[WebSocket] 개인 일정 생성 알림 전송 완료");
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleScheduleUpdateEvent(ScheduleUpdateEvent event) {
        Schedule schedule = event.getSchedule();

        ScheduleDto dto = ScheduleDto.builder()
                .scheduleId(schedule.getScheduleId())
                .userId(schedule.getUser().getUserId())
                .title(schedule.getTitle())
                .description(schedule.getDescription())
                .startDate(schedule.getStartDate())
                .endDate(schedule.getEndDate())
                .color(schedule.getColor())
                .build();

        messagingTemplate.convertAndSendToUser(
                schedule.getUser().getEmail(),
                "/queue/schedule",
                dto
        );
        System.out.println("[WebSocket] 개인 일정 수정 알림 전송 완료");
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleScheduleDeleteEvent(ScheduleDeleteEvent event) {
        Schedule schedule = event.getSchedule();

        ScheduleDto dto = ScheduleDto.builder()
                .scheduleId(schedule.getScheduleId())
                .userId(schedule.getUser().getUserId())
                .title(schedule.getTitle())
                .description(schedule.getDescription())
                .startDate(schedule.getStartDate())
                .endDate(schedule.getEndDate())
                .color(schedule.getColor())
                .build();

        messagingTemplate.convertAndSendToUser(
                schedule.getUser().getEmail(),
                "/queue/schedule",
                dto
        );
        System.out.println("[WebSocket] 개인 일정 삭제 알림 전송 완료");
    }
}
