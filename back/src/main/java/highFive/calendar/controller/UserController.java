package highFive.calendar.controller;

import highFive.calendar.dto.ApiResponse;
import highFive.calendar.dto.UserDto;
import highFive.calendar.dto.UserMapper;
import highFive.calendar.entity.User;
import highFive.calendar.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController implements UserMapper {

    @Autowired
    private UserService userService;

    //  회원가입
    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody UserDto userDto) {
        User user = dtoToEntity(userDto);
        User createUser = userService.register(user);
        return ResponseEntity.ok(entityToDto(createUser));
    }

    //  로그인
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody UserDto userDto) {
//        return userService.login(userDto.getEmail(), userDto.getPwd())
//                .map(user -> ResponseEntity.ok(entityToDto(user)))
//                .orElse(ResponseEntity.status(401).body("Invalid credentials"));
//    } 로그인 성공 시 UserDto 반환, 실패 시 String("Invalid credentials")을 반환해 반환 타입이 달라서 에러 발생
//    반환 타입을 ResponseEntity<?> 또는 ResponseEntity<Object>로 변경해도 에러 발생

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserDto>> login(@RequestBody UserDto userDto) {
        return userService.login(userDto.getEmail(), userDto.getPwd())
                .map(user -> {
                    UserDto dto = entityToDto(user);
                    ApiResponse<UserDto> response = ApiResponse.<UserDto>builder()
                            .data(dto)
                            .message("Success")
                            .build();
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    ApiResponse<UserDto> response = ApiResponse.<UserDto>builder()
                            .data(null)
                            .message("Invalid credentials")
                            .build();
                    return ResponseEntity.status(401).body(response);
                });
    }

    //  프로필 수정
    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long userId, @RequestBody UserDto userDto) {
        // DTO에서 엔티티로 변환 후, URL의 userId를 강제 세팅
        User user = dtoToEntity(userDto);
        user.setUserId(userId);
        User updatedUser = userService.updateUser(user);
        return ResponseEntity.ok(entityToDto(updatedUser));
    }
    //  회원 탈퇴
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }


}
