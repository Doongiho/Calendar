package highFive.calendar.dto;

import highFive.calendar.entity.Schedule;
import highFive.calendar.entity.User;

public interface ScheduleMapper {
    default ScheduleDto entityToDto(Schedule schedule) {
        return ScheduleDto.builder()
                .scheduleId(schedule.getScheduleId())
                .userId(schedule.getUser().getUserId())
                .title(schedule.getTitle())
                .description(schedule.getDescription())
                .startDate(schedule.getStartDate())
                .endDate(schedule.getEndDate())
                .color(schedule.getColor())
                .build();
    }

    default Schedule dtoToEntity(ScheduleDto dto) {
        return Schedule.builder()
                .scheduleId(dto.getScheduleId())
                .user(User.builder().userId(dto.getUserId()).build())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .color(dto.getColor())
                .build();
    }
}