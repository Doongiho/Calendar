package highFive.calendar.service;

import highFive.calendar.entity.Schedule;
import highFive.calendar.entity.User;
import highFive.calendar.event.ScheduleCreateEvent;
import highFive.calendar.event.ScheduleDeleteEvent;
import highFive.calendar.event.ScheduleUpdateEvent;
import highFive.calendar.repository.ScheduleRepository;
import highFive.calendar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Transactional
    public Schedule createSchedule(Schedule schedule) {
        User user = userRepository.findById(schedule.getUser().getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        schedule.setUser(user);
        Schedule saved = scheduleRepository.save(schedule);

        // 이벤트 발행
        eventPublisher.publishEvent(new ScheduleCreateEvent(saved));

        return saved;
    }

    @Transactional
    public Schedule updateSchedule(Schedule schedule) {
        User user = userRepository.findById(schedule.getUser().getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        schedule.setUser(user);
        Schedule updated = scheduleRepository.save(schedule);

        // 이벤트 발행
        eventPublisher.publishEvent(new ScheduleUpdateEvent(updated));

        return updated;
    }

    @Transactional
    public void deleteSchedule(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("스케줄을 찾을 수 없습니다."));
        scheduleRepository.deleteById(scheduleId);

        // 이벤트 발행
        eventPublisher.publishEvent(new ScheduleDeleteEvent(schedule));
    }

    public Schedule getSchedule(Long scheduleId) {
        return scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("스케줄을 찾을 수 없습니다."));
    }

    public List<Schedule> getSchedulesByUser(Long userId) {
        return scheduleRepository.findByUser_UserId(userId);
    }

    public boolean isOwner(Long scheduleId, Long userId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("스케줄을 찾을 수 없습니다."));
        return schedule.getUser().getUserId().equals(userId);
    }
}
