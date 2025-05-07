package highFive.calendar.dto;

import highFive.calendar.entity.Team;
import highFive.calendar.entity.TeamSchedule;
import highFive.calendar.entity.User;

public interface TeamScheduleMapper {

    //  Entity -> DTO
    default TeamScheduleDto entityToDto(TeamSchedule teamSchedule) {
        return TeamScheduleDto.builder()
                .teamScheduleId(teamSchedule.getTeamScheduleId())
                .teamId(teamSchedule.getTeam().getTeamId())
                .userId(teamSchedule.getUser().getUserId())
                .userName(teamSchedule.getUser().getName())
                .title(teamSchedule.getTitle())
                .description(teamSchedule.getDescription())
                .color(teamSchedule.getColor())
                .startDate(teamSchedule.getStartDate())
                .endDate(teamSchedule.getEndDate())
                .build();
    }

    //  DTO -> Entity
    default TeamSchedule dtoToEntity(TeamScheduleDto teamScheduleDto, Team team, User user) {
        return TeamSchedule.builder()
                .teamScheduleId(teamScheduleDto.getTeamScheduleId())
                .team(team)
                .user(user)
                .startDate(teamScheduleDto.getStartDate())
                .endDate(teamScheduleDto.getEndDate())
                .title(teamScheduleDto.getTitle())
                .description(teamScheduleDto.getDescription())
                .color(teamScheduleDto.getColor())
                .build();
    }
}
