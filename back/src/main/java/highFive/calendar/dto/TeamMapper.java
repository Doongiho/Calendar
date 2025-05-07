package highFive.calendar.dto;

import highFive.calendar.entity.Team;
import highFive.calendar.entity.User;

public interface TeamMapper {

    //  Entity -> DTO
    default TeamDto entityToDto(Team team) {
        return TeamDto.builder()
                .teamId(team.getTeamId())
                .teamName(team.getTeamName())
                .description(team.getDescription())
                .createdAt(team.getCreatedAt())
                .userId(team.getUser().getUserId())
                .userEmail(team.getUser().getEmail())
                .userName(team.getUser().getName())
                .build();
    }

    //  DTO -> Entity
    default Team dtoToEntity(TeamDto teamDto, User user) {
        return Team.builder()
                .teamId(teamDto.getTeamId())
                .user(user)
                .teamName(teamDto.getTeamName())
                .description(teamDto.getDescription())
                .createdAt(teamDto.getCreatedAt())
                .build();
    }

}
