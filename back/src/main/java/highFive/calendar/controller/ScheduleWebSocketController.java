package highFive.calendar.controller;

import highFive.calendar.dto.ScheduleDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ScheduleWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public ScheduleWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // 클라이언트에서 "/app/schedule"로 보낸 메시지 처리
    @MessageMapping("/schedule")
    @SendTo("/topic/schedule")
    public ScheduleDto broadcastSchedule(ScheduleDto message) {
        return message;
    }

    // 수정 메시지 전송
    @MessageMapping("/schedule/update")
    @SendTo("/topic/schedule")
    public ScheduleDto updateSchedule(ScheduleDto message) {
        return message;
    }

    // 삭제 메시지 전송
    @MessageMapping("/schedule/delete")
    @SendTo("/topic/schedule")
    public ScheduleDto deleteSchedule(ScheduleDto message) {
        return message;
    }

    // 특정 사용자에게 메시지 보내기
    public void sendToUser(String userId, ScheduleDto message) {
        messagingTemplate.convertAndSend("/user/" + userId + "/queue/schedule", message);
    }
}
