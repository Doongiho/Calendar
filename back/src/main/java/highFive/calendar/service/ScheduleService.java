package highFive.calendar.service;

import highFive.calendar.entity.Schedule;
import highFive.calendar.entity.User;
import highFive.calendar.repository.ScheduleRepository;
import highFive.calendar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private UserRepository userRepository;

    public Schedule createSchedule(Schedule schedule) {
        User user = userRepository.findById(schedule.getUser().getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        schedule.setUser(user);
        return scheduleRepository.save(schedule);
    }

    public Schedule getSchedule(Long scheduleId) {
        return scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("스케줄을 찾을 수 없습니다."));
    }

    public List<Schedule> getSchedulesByUser(Long userId) {
        return scheduleRepository.findByUser_UserId(userId);
    }

    public Schedule updateSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    public void deleteSchedule(Long scheduleId) {
        scheduleRepository.deleteById(scheduleId);
    }
}