package highFive.calendar.event;

import highFive.calendar.entity.TeamSchedule;

public class TeamScheduleCreatedEvent {
    private final TeamSchedule teamSchedule;

    public TeamScheduleCreatedEvent(TeamSchedule teamSchedule) {
        this.teamSchedule = teamSchedule;
    }

    public TeamSchedule getTeamSchedule() {
        return teamSchedule;
    }
}