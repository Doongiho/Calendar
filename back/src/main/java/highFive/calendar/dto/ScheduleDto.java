package highFive.calendar.dto;

import highFive.calendar.enums.ScheduleColor;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleDto {
    private Long scheduleId;
    private Long userId;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private ScheduleColor color;
}