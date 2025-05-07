package highFive.calendar.dto;

import highFive.calendar.enums.ScheduleColor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class TeamScheduleDto {

    private Long teamScheduleId;
    private Long teamId;
    private Long userId;
    private String userName;
    private String title;
    private String description;
    private ScheduleColor color;
    private LocalDateTime startDate;
    private LocalDateTime endDate;


}
