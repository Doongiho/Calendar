package highFive.calendar.event;

import highFive.calendar.entity.Schedule;  // 개인일정 엔티티

public class ScheduleCreateEvent {
    private final Schedule schedule;

    public ScheduleCreateEvent(Schedule schedule) {
        this.schedule = schedule;
    }

    public Schedule getSchedule() {
        return schedule;
    }
}
