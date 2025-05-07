package highFive.calendar.dto;

import highFive.calendar.entity.Invitation;

import java.time.LocalDateTime;

public interface InvitationMapper {

    //  Entity -> DTO
    default InvitationDto entityToDto(Invitation invitation) {
        return InvitationDto.builder()
                .invitationId(invitation.getInvitationsId())
                .teamId(invitation.getTeam().getTeamId())
                .inviterId(invitation.getInviter().getUserId())
                .inviterName(invitation.getInviter().getName())
                .inviterEmail(invitation.getInviter().getEmail())
                .invitedUserId(invitation.getInvitedUser().getUserId())
                .invitedUserName(invitation.getInvitedUser().getName())
                .invitedUserEmail(invitation.getInvitedUser().getEmail())
                .status(invitation.getStatus())
                .sentAt(invitation.getSentAt())
                .responsedAt(invitation.getResponsedAt())
                .build();
    }
}
