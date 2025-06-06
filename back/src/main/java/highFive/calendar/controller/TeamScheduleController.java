package highFive.calendar.controller;

import highFive.calendar.dto.ApiResponse;
import highFive.calendar.dto.TeamScheduleDto;
import highFive.calendar.dto.TeamScheduleMapper;
import highFive.calendar.entity.Team;
import highFive.calendar.entity.TeamSchedule;
import highFive.calendar.entity.User;
import highFive.calendar.repository.UserRepository;
import highFive.calendar.service.TeamScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/api/team-schedules")
public class TeamScheduleController implements TeamScheduleMapper {

    @Autowired
    private TeamScheduleService teamScheduleService;
    @Autowired
    private UserRepository userRepository;

    // 팀 스케줄 생성
    @PostMapping("")
    @PreAuthorize("@teamMemberService.isTeamMember(#teamScheduleDto.teamId, #teamScheduleDto.userId)")

    public ResponseEntity<ApiResponse<TeamScheduleDto>> createTeamSchedule(
            @RequestBody TeamScheduleDto teamScheduleDto) {
        System.out.println("✅ 컨트롤러 진입함");
        System.out.println("➡ userId = " + teamScheduleDto.getUserId());
        System.out.println("➡ teamId = " + teamScheduleDto.getTeamId());
        try {
            User user = userRepository.findById(teamScheduleDto.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            TeamSchedule teamSchedule = dtoToEntity(teamScheduleDto,
                    Team.builder().teamId(teamScheduleDto.getTeamId()).build(),
                    user);

            TeamSchedule createdTeamSchedule = teamScheduleService.createTeamSchedule(teamSchedule);
            TeamScheduleDto responseDto = entityToDto(createdTeamSchedule);

            ApiResponse<TeamScheduleDto> response = ApiResponse.<TeamScheduleDto>builder()
                    .data(responseDto)
                    .message("팀 스케줄 생성 성공")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<TeamScheduleDto> response = ApiResponse.<TeamScheduleDto>builder()
                    .data(null)
                    .message("팀 스케줄 생성 실패: " + e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    // 팀 스케줄 조회 (전체)
    @GetMapping("/team/{teamId}")
    public ResponseEntity<ApiResponse<List<TeamScheduleDto>>> getTeamSchedulesByTeam(
            @PathVariable(name = "teamId") Long teamId) {
        try {
            List<TeamSchedule> teamSchedules = teamScheduleService.getTeamSchedulesByTeam(teamId);
            List<TeamScheduleDto> teamScheduleDtos = teamSchedules.stream()
                    .map(this::entityToDto)
                    .collect(Collectors.toList());

            ApiResponse<List<TeamScheduleDto>> response = ApiResponse.<List<TeamScheduleDto>>builder()
                    .data(teamScheduleDtos)
                    .message("조회 성공")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<List<TeamScheduleDto>> response = ApiResponse.<List<TeamScheduleDto>>builder()
                    .data(null)
                    .message("조회 실패: " + e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    // 팀 스케줄 조회 (단일 -> 스케줄 id 별로 조회)
    @GetMapping("/{teamScheduleId}")
    public ResponseEntity<ApiResponse<TeamScheduleDto>> getTeamScheduleById(
            @PathVariable(name = "teamScheduleId") Long teamScheduleId) {
        try {
            TeamSchedule teamSchedule = teamScheduleService.getTeamScheduleById(teamScheduleId)
                    .orElseThrow(() -> new IllegalArgumentException("Team schedule not found"));

            TeamScheduleDto teamScheduleDto = entityToDto(teamSchedule);

            ApiResponse<TeamScheduleDto> response = ApiResponse.<TeamScheduleDto>builder()
                    .data(teamScheduleDto)
                    .message("조회 성공")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<TeamScheduleDto> response = ApiResponse.<TeamScheduleDto>builder()
                    .data(null)
                    .message("조회 실패: " + e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    // 팀 스케줄 수정
    @PutMapping("/{teamScheduleId}")
    @PreAuthorize("@teamMemberService.isTeamMember(#teamScheduleDto.teamId, principal.userId)")
    public ResponseEntity<ApiResponse<TeamScheduleDto>> updateTeamSchedule(
            @PathVariable(name = "teamScheduleId") Long teamScheduleId,
            @RequestBody TeamScheduleDto teamScheduleDto) {
        try {
            TeamSchedule existingSchedule = teamScheduleService.getTeamScheduleById(teamScheduleId)
                    .orElseThrow(() -> new IllegalArgumentException("Team schedule not found"));

            existingSchedule.setTitle(teamScheduleDto.getTitle());
            existingSchedule.setDescription(teamScheduleDto.getDescription());
            existingSchedule.setColor(teamScheduleDto.getColor());
            existingSchedule.setStartDate(teamScheduleDto.getStartDate());
            existingSchedule.setEndDate(teamScheduleDto.getEndDate());

            TeamSchedule updatedSchedule = teamScheduleService.updateTeamSchedule(existingSchedule);
            TeamScheduleDto responseDto = entityToDto(updatedSchedule);

            ApiResponse<TeamScheduleDto> response = ApiResponse.<TeamScheduleDto>builder()
                    .data(responseDto)
                    .message("수정 성공")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<TeamScheduleDto> response = ApiResponse.<TeamScheduleDto>builder()
                    .data(null)
                    .message("수정 실패: " + e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    // 팀 스케줄 삭제
    @DeleteMapping("/{teamScheduleId}")
    public ResponseEntity<ApiResponse<Void>> deleteTeamSchedule(
            @PathVariable(name = "teamScheduleId") Long teamScheduleId) {
        try {
            teamScheduleService.deleteTeamSchedule(teamScheduleId);

            ApiResponse<Void> response = ApiResponse.<Void>builder()
                    .data(null)
                    .message("삭제 성공")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<Void> response = ApiResponse.<Void>builder()
                    .data(null)
                    .message("삭제 실패: " + e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }
}
