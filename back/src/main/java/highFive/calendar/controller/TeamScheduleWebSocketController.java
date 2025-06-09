package highFive.calendar.controller;

import highFive.calendar.dto.TeamScheduleDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class TeamScheduleWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public TeamScheduleWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // 클라이언트에서 "/app/team/schedule"로 보낸 메시지 처리
    @MessageMapping("/team/schedule")
    @SendTo("/topic/team/schedule") // 구독자에게 브로드캐스트
    public TeamScheduleDto broadcastTeamSchedule(TeamScheduleDto message) {
        return message;
    }

     // ✅ UPDATE
    @MessageMapping("/team/schedule/update")
    @SendTo("/topic/team/schedule")
    public TeamScheduleDto updateTeamSchedule(TeamScheduleDto message) {
        return message;
    }

    // ✅ DELETE
    @MessageMapping("/team/schedule/delete")
    @SendTo("/topic/team/schedule")
    public TeamScheduleDto deleteTeamSchedule(TeamScheduleDto message) {
        return message;
    }

    // 특정 팀에게만 메시지 전송 (예: 팀 ID가 포함된 경우)
    public void sendToTeam(String teamId, TeamScheduleDto message) {
        messagingTemplate.convertAndSend("/topic/team/" + teamId, message);
    }
}
