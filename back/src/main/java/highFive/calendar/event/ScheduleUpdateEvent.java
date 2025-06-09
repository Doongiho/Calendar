package highFive.calendar.event;

import highFive.calendar.entity.Schedule;

public class ScheduleUpdateEvent {
    private final Schedule schedule;

    public ScheduleUpdateEvent(Schedule schedule) {
        this.schedule = schedule;
    }

    public Schedule getSchedule() {
        return schedule;
    }
}
