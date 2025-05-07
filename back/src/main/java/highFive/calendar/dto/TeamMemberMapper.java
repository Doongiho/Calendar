package highFive.calendar.dto;

import highFive.calendar.entity.TeamMember;

public interface TeamMemberMapper {

    //  Entity -> DTO
    default TeamMemberDto entityToDto(TeamMember teamMember) {
        return TeamMemberDto.builder()
                .teamMemberId(teamMember.getTeamMemberId())
                .teamId(teamMember.getTeam().getTeamId())
                .userId(teamMember.getUser().getUserId())
                .userName(teamMember.getUser().getName())
                .userEmail(teamMember.getUser().getEmail())
                .joinedAt(teamMember.getJoinedAt())
                .build();
    }


}
