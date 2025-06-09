package highFive.calendar.event;

import highFive.calendar.entity.Schedule;

public class ScheduleDeleteEvent {
    private final Schedule schedule;

    public ScheduleDeleteEvent(Schedule schedule) {
        this.schedule = schedule;
    }

    public Schedule getSchedule() {
        return schedule;
    }
}
