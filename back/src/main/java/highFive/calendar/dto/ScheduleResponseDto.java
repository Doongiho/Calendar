package highFive.calendar.dto;

import highFive.calendar.enums.ScheduleColor;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleResponseDto {

    private Long scheduleId;
    private Long userId;
    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private ScheduleColor color;
}
