package highFive.calendar.event;

import highFive.calendar.entity.TeamSchedule;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class TeamScheduleUpdatedEvent extends ApplicationEvent {
    private final TeamSchedule teamSchedule;

    public TeamScheduleUpdatedEvent(TeamSchedule teamSchedule) {
        super(teamSchedule);
        this.teamSchedule = teamSchedule;
    }
}