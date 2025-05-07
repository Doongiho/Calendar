package highFive.calendar.dto;

import highFive.calendar.enums.InvitationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class InvitationDto {

    private Long invitationId;
    private Long teamId;
    private Long inviterId;
    private String inviterName;
    private String inviterEmail;
    private Long invitedUserId;
    private String invitedUserName;
    private String invitedUserEmail;
    private InvitationStatus status;
    private LocalDateTime sentAt;
    private LocalDateTime responsedAt;
}
