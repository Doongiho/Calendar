package highFive.calendar.service;

import highFive.calendar.entity.Invitation;
import highFive.calendar.entity.User;
import highFive.calendar.enums.InvitationStatus;
import highFive.calendar.repository.InvitationRepository;
import highFive.calendar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InvitationService {

    @Autowired
    private InvitationRepository invitationRepository;
    @Autowired
    private UserRepository userRepository;

    //  초대 응답 처리
    @Transactional
    public Invitation respondToInvitation(Long invitationId, InvitationStatus status) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new IllegalArgumentException("Invitation not found"));

        invitation.setStatus(status);
        invitation.setResponsedAt(LocalDateTime.now());

        return invitationRepository.save(invitation);
    }

    //  특정 유저에게 온 모든 초대 조회
    public List<Invitation> getUserInvitations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return invitationRepository.findByInvitedUser(user);
    }
}
