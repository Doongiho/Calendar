package highFive.calendar.controller;

import highFive.calendar.dto.*;
import highFive.calendar.entity.Invitation;
import highFive.calendar.entity.Team;
import highFive.calendar.entity.TeamMember;
import highFive.calendar.entity.User;
import highFive.calendar.repository.UserRepository;
import highFive.calendar.service.TeamMemberService;
import highFive.calendar.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teams")
public class TeamController implements TeamMapper, TeamMemberMapper, InvitationMapper {

    @Autowired
    private TeamService teamService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TeamMemberService teamMemberService;

    //  팀 생성
    @PostMapping("")
    public ResponseEntity<ApiResponse<TeamDto>> createTeam(@RequestBody TeamDto teamDto) {
        try {
            User user = userRepository.findById(teamDto.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            Team team = Team.builder()
                    .user(user)
                    .teamName(teamDto.getTeamName())
                    .description(teamDto.getDescription())
                    .build();

            Team createdTeam = teamService.createTeam(team);
            TeamDto responseDto = entityToDto(createdTeam);

            ApiResponse<TeamDto> response = ApiResponse.<TeamDto>builder()
                    .data(responseDto)
                    .message("Team created successfully")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<TeamDto> response = ApiResponse.<TeamDto>builder()
                    .data(null)
                    .message("Failed to create team: " + e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    //  유저가 속한 팀 목록 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<TeamDto>>> getAllTeamsByUser(@PathVariable(name = "userId") Long userId) {
        try {
            List<Team> teams = teamService.getAllTeamsByUser(userId);
            List<TeamDto> teamDtos = teams.stream()
                    .map(this::entityToDto)
                    .collect(Collectors.toList());

            ApiResponse<List<TeamDto>> response = ApiResponse.<List<TeamDto>>builder()
                    .data(teamDtos)
                    .message("팀 목록 조회 성공")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<List<TeamDto>> response = ApiResponse.<List<TeamDto>>builder()
                    .data(null)
                    .message("팀 목록 조회 실패: " + e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    //  팀 정보 조회
    @GetMapping("/{teamId}")
    public ResponseEntity<ApiResponse<TeamDto>> getTeamById(@PathVariable(name = "teamId") Long teamId) {
        try {
            Team team = teamService.getTeamById(teamId);
            TeamDto teamDto = entityToDto(team);

            ApiResponse<TeamDto> response = ApiResponse.<TeamDto>builder()
                    .data(teamDto)
                    .message("팀 조회 성공")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<TeamDto> response = ApiResponse.<TeamDto>builder()
                    .data(null)
                    .message("팀 조회 실패: " + e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    //  팀 정보 수정
    @PutMapping("/{teamId}")
    public ResponseEntity<ApiResponse<TeamDto>> updateTeam(@PathVariable(name = "teamId") Long teamId,
            @RequestBody TeamDto teamDto) {
        try {
            Team existingTeam = teamService.getTeamById(teamId);
            existingTeam.setTeamName(teamDto.getTeamName());
            existingTeam.setDescription(teamDto.getDescription());

            Team updatedTeam = teamService.updateTeam(existingTeam);
            TeamDto responseDto = entityToDto(updatedTeam);

            ApiResponse<TeamDto> response = ApiResponse.<TeamDto>builder()
                    .data(responseDto)
                    .message("팀 수정 성공")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<TeamDto> response = ApiResponse.<TeamDto>builder()
                    .data(null)
                    .message("팀 수정 실패: " + e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    //  팀 삭제
    @DeleteMapping("/{teamId}")
    public ResponseEntity<ApiResponse<Void>> deleteTeam(@PathVariable(name = "teamId") Long teamId) {
        try {
            teamService.deleteTeam(teamId);

            ApiResponse<Void> response = ApiResponse.<Void>builder()
                    .data(null)
                    .message("팀 삭제 성공")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<Void> response = ApiResponse.<Void>builder()
                    .data(null)
                    .message("팀 삭제 실패: " + e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    //  팀원 초대
    @PostMapping("/{teamId}/invitations")
    public ResponseEntity<ApiResponse<InvitationDto>> inviteUserToTeam(@PathVariable(name = "teamId") Long teamId,
            @RequestParam(name = "inviterId") Long inviterId,
            @RequestParam(name = "invitedUserId") Long invitedUserId) {
        try {
            Invitation invitation = teamMemberService.inviteUserToTeam(teamId, inviterId, invitedUserId);
            InvitationDto invitationDto = entityToDto(invitation);

            ApiResponse<InvitationDto> response = ApiResponse.<InvitationDto>builder()
                    .data(invitationDto)
                    .message("사용자 초대 성공")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<InvitationDto> response = ApiResponse.<InvitationDto>builder()
                    .data(null)
                    .message("사용자 초대 실패: " + e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    //  초대 수락
    @PutMapping("/invitations/{invitationId}/accept")
    public ResponseEntity<ApiResponse<TeamMemberDto>> acceptTeamInvitation(
            @PathVariable(name = "invitationId") Long invitationId,
            @RequestParam(name = "actionUserId") Long actionUserId) {
        try {
            TeamMember teamMember = teamMemberService.acceptTeamInvitation(invitationId, actionUserId);
            TeamMemberDto teamMemberDto = entityToDto(teamMember);

            ApiResponse<TeamMemberDto> response = ApiResponse.<TeamMemberDto>builder()
                    .data(teamMemberDto)
                    .message("초대 수락 성공")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<TeamMemberDto> response = ApiResponse.<TeamMemberDto>builder()
                    .data(null)
                    .message("초대 수락 실패: " + e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    //  초대 거절
    @PutMapping("/invitations/{invitationId}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectTeamInvitation(
            @PathVariable(name = "invitationId") Long invitationId,
            @RequestParam(name = "actionUserId") Long actionUserId) {
        try {
            teamMemberService.rejectTeamInvitation(invitationId, actionUserId);

            ApiResponse<Void> response = ApiResponse.<Void>builder()
                    .data(null)
                    .message("팀 초대 거절 성공")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<Void> response = ApiResponse.<Void>builder()
                    .data(null)
                    .message("팀 초대 거절 실패: " + e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    //  팀 멤버 목록 조회
    @GetMapping("/{teamId}/members")
    public ResponseEntity<ApiResponse<List<TeamMemberDto>>> getTeamMembers(@PathVariable(name = "teamId") Long teamId) {
        try {
            List<TeamMember> teamMembers = teamMemberService.getTeamMembers(teamId);
            List<TeamMemberDto> teamMemberDtos = teamMembers.stream()
                    .map(this::entityToDto)
                    .collect(Collectors.toList());

            ApiResponse<List<TeamMemberDto>> response = ApiResponse.<List<TeamMemberDto>>builder()
                    .data(teamMemberDtos)
                    .message("조회 성공")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<List<TeamMemberDto>> response = ApiResponse.<List<TeamMemberDto>>builder()
                    .data(null)
                    .message("조회 실패: " + e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    //  팀원 삭제
    @DeleteMapping("/{teamId}/members/{userId}")
    public ResponseEntity<ApiResponse<Void>> removeTeamMember(@PathVariable(name = "teamId") Long teamId,
            @PathVariable(name = "userId") Long userId,
            @RequestParam(name = "leaderId", required = false) Long leaderId) {
        try {
            if (leaderId != null) {
                //  팀 생성자가 팀원 강퇴
                teamMemberService.kickTeamMember(teamId, userId, leaderId);
            } else {
                //  팀원이 스스로 나가는 경우
                teamMemberService.leaveTeam(teamId, userId);
            }

            ApiResponse<Void> response = ApiResponse.<Void>builder()
                    .data(null)
                    .message("팀원 삭제 성공")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<Void> response = ApiResponse.<Void>builder()
                    .data(null)
                    .message("팀원 삭제 실패: " + e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

}
