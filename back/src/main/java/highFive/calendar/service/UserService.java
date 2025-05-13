package highFive.calendar.service;

import highFive.calendar.config.CustomUserDetails;
import highFive.calendar.entity.User;
import highFive.calendar.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    //  회원가입
    @Transactional
    public User register(User user) {
        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 등록된 이메일입니다.");
        }
        user.setPwd(passwordEncoder.encode(user.getPassword()));    //  비밀번호 암호화
        return userRepository.save(user);
    }

    //  로그인
    public Optional<User> login(String email, String pwd) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if(userOptional.isPresent() && passwordEncoder.matches(pwd, userOptional.get().getPwd())) {
            return userOptional;
        }
        return  Optional.empty();
    }

    //  프로필 조회
    public Optional<User> findById(Long userId) { return userRepository.findById(userId);
    }

    //  회원정보 수정
    @Transactional
    public User updateUser(User user) {
        User existingUser = userRepository.findById(user.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 1. 비밀번호가 null/빈값이 아니고,
        // 2. 기존 비밀번호와 다를 때만 인코딩해서 저장
        if (user.getPwd() != null && !user.getPwd().isBlank() &&
                !passwordEncoder.matches(user.getPwd(), existingUser.getPwd())) {
            // 새 비밀번호로 변경
            existingUser.setPwd(passwordEncoder.encode(user.getPwd()));
        } else {
            // 비밀번호 변경이 없으면 기존 값 유지
            existingUser.setPwd(existingUser.getPwd());
        }

        // 나머지 필드 업데이트 (예시)
        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setGender(user.getGender());

        return userRepository.save(existingUser);
    }

    //  회원탈퇴
    @Transactional
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }


    //  사용자 이메일로 검색 (Spring Security 필수 구현)
    @Override
    public CustomUserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return new CustomUserDetails(user); // 커스텀 객체 반환
    }
}
