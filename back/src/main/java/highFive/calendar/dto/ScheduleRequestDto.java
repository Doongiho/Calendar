package highFive.calendar.dto;

import highFive.calendar.enums.ScheduleColor;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleRequestDto {
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private ScheduleColor color;
}