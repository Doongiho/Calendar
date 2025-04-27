package highFive.calendar.controller;

import highFive.calendar.dto.ApiResponse;
import highFive.calendar.dto.ScheduleDto;
import highFive.calendar.entity.Schedule;
import highFive.calendar.service.ScheduleService;
import highFive.calendar.dto.ScheduleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController implements ScheduleMapper {

    @Autowired
    private ScheduleService scheduleService;

    // 스케줄 생성
    @PostMapping
    public ResponseEntity<ScheduleDto> createSchedule(@RequestBody ScheduleDto scheduleDto) {
        Schedule schedule = dtoToEntity(scheduleDto);
        Schedule createdSchedule = scheduleService.createSchedule(schedule);
        return ResponseEntity.ok(entityToDto(createdSchedule));
    }

    // 스케줄 단건 조회
    @GetMapping("/{scheduleId}")
    public ResponseEntity<ScheduleDto> getSchedule(@PathVariable("scheduleId") Long scheduleId) { // 🔧 수정: 변수명 명시
        Schedule schedule = scheduleService.getSchedule(scheduleId);
        return ResponseEntity.ok(entityToDto(schedule));
    }

    // 사용자 스케줄 전체 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ScheduleDto>> getSchedulesByUser(@PathVariable("userId") Long userId) { // 🔧 수정: 변수명 명시
        List<Schedule> schedules = scheduleService.getSchedulesByUser(userId);
        List<ScheduleDto> dtos = schedules.stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // 스케줄 수정
    @PutMapping("/{scheduleId}")
    public ResponseEntity<ScheduleDto> updateSchedule(@PathVariable("scheduleId") Long scheduleId, @RequestBody ScheduleDto scheduleDto) { // 🔧 수정: 변수명 명시
        Schedule schedule = dtoToEntity(scheduleDto);
        schedule.setScheduleId(scheduleId);
        Schedule updated = scheduleService.updateSchedule(schedule);
        return ResponseEntity.ok(entityToDto(updated));
    }

    // 스케줄 삭제
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable("scheduleId") Long scheduleId) { // 🔧 수정: 변수명 명시
        scheduleService.deleteSchedule(scheduleId);
        return ResponseEntity.ok().build();
    }
}
