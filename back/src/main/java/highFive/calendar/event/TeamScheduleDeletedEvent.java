package highFive.calendar.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class TeamScheduleDeletedEvent extends ApplicationEvent {
    private final Long teamScheduleId;
    private final Long teamId;

    public TeamScheduleDeletedEvent(Long teamScheduleId, Long teamId) {
        super(teamScheduleId);
        this.teamScheduleId = teamScheduleId;
        this.teamId = teamId;
    }
}
