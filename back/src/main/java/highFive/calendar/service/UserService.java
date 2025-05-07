package highFive.calendar.service;

import highFive.calendar.entity.User;
import highFive.calendar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    //  회원가입
    @Transactional
    public User register(User user) {
        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 등록된 이메일입니다.");
        }
        return userRepository.save(user);
    }

    //  로그인
    public Optional<User> login(String email, String pwd) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if(userOptional.isPresent() && userOptional.get().getPwd().equals(pwd)) {
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
        if(!userRepository.existsById(user.getUserId())) {
            throw new IllegalArgumentException("User not found");
        }
        return userRepository.save(user);
    }

    //  회원탈퇴
    @Transactional
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }




}
