package highFive.calendar.controller;

import highFive.calendar.dto.*;
import highFive.calendar.entity.Invitation;
import highFive.calendar.entity.User;
import highFive.calendar.service.TeamMemberService;
import highFive.calendar.service.UserService;
import highFive.calendar.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.Optional;

import highFive.calendar.config.CustomUserDetails;

@RestController
@RequestMapping("/api/users")
public class UserController implements UserMapper, InvitationMapper {

    @Autowired
    private UserService userService;

    @Autowired
    private TeamMemberService teamMemberService;

    @Autowired
    private JwtUtil jwtUtil;

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody UserDto userDto) {
        User user = dtoToEntity(userDto);
        User createUser = userService.register(user);
        return ResponseEntity.ok(entityToDto(createUser));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserDto>> login(@RequestBody UserDto userDto) {
        Optional<User> userOptional = userService.login(userDto.getEmail(), userDto.getPwd());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String token = jwtUtil.generateToken(user.getEmail()); // JWT 토큰 발급

            UserDto dto = entityToDto(user);
            ApiResponse<UserDto> response = ApiResponse.<UserDto>builder()
                    .data(dto)
                    .message("Success")
                    .token(token)
                    .build();

            return ResponseEntity.ok(response);
        } else {
            ApiResponse<UserDto> response = ApiResponse.<UserDto>builder()
                    .data(null)
                    .message("Invalid credentials")
                    .build();

            return ResponseEntity.status(401).body(response);
        }
    }

    // 프로필 조회
    @GetMapping("/{userId}")
    @PreAuthorize("principal.userId == #userId")
    public ResponseEntity<Optional<User>> findById(@PathVariable(name = "userId") Long userId) {
        Optional<User> userDto = userService.findById(userId);
        return ResponseEntity.ok(userDto);
    }

    // 로그인된 사용자 본인 정보 수정
    @PutMapping("/me")
    public ResponseEntity<UserDto> updateMyInfo(
            @RequestBody UserDto userDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        // ✅ 인증 확인 로그
        if (userDetails == null) {
            System.out.println("❌ 인증 실패: userDetails가 null입니다.");
            throw new AccessDeniedException("로그인되지 않은 사용자입니다.");
        }

        System.out.println("✅ 인증된 사용자 email: " + userDetails.getUsername());
        System.out.println("✅ 인증된 userId: " + userDetails.getUserId());

        userDto.setUserId(userDetails.getUserId()); // 강제 설정

        User updatedUser = userService.updateUser(dtoToEntity(userDto));
        return ResponseEntity.ok(entityToDto(updatedUser));
    }

    // 회원 탈퇴
    @DeleteMapping("/{userId}")
    @PreAuthorize("principal.userId == #userId") // 본인 확인
    public ResponseEntity<Void> deleteUser(@PathVariable(name = "userId") Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }

    // 특정 유저에게 온 모든 초대 조회
    @GetMapping("/{userId}/invitations")
    @PreAuthorize("principal.userId == #userId")
    public ResponseEntity<ApiResponse<List<InvitationDto>>> getUserInvitations(
            @PathVariable(name = "userId") Long userId) {
        List<Invitation> invitations = teamMemberService.getUserInvitations(userId);
        List<InvitationDto> invitationDtos = invitations.stream()
                .map(this::entityToDto)
                .toList();

        ApiResponse<List<InvitationDto>> response = ApiResponse.<List<InvitationDto>>builder()
                .data(invitationDtos) //
                .message("초대 목록 조회 성공")
                .build();

        return ResponseEntity.ok(response);
    }

    // 특정 유저에게 온 PENDING 상태 초대 조회
    @GetMapping("/{userId}/invitations/pending")
    @PreAuthorize("principal.userId == #userId")
    public ResponseEntity<ApiResponse<List<InvitationDto>>> getPendingInvitationsForUser(
            @PathVariable(name = "userId") Long userId) {
        List<Invitation> invitations = teamMemberService.getPendingInvitationsForUser(userId);
        List<InvitationDto> invitationDtos = invitations.stream()
                .map(this::entityToDto)
                .toList();

        ApiResponse<List<InvitationDto>> response = ApiResponse.<List<InvitationDto>>builder()
                .data(invitationDtos) //
                .message("초대 목록 조회 성공")
                .build();

        return ResponseEntity.ok(response);
    }

}
