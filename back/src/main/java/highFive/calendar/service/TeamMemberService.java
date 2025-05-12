package highFive.calendar.service;


import highFive.calendar.config.CustomUserDetails;
import highFive.calendar.entity.Invitation;
import highFive.calendar.entity.Team;
import highFive.calendar.entity.TeamMember;
import highFive.calendar.entity.User;
import highFive.calendar.enums.InvitationStatus;
import highFive.calendar.repository.InvitationRepository;
import highFive.calendar.repository.TeamMemberRepository;
import highFive.calendar.repository.TeamRepository;
import highFive.calendar.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
public class TeamMemberService {

    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TeamMemberRepository teamMemberRepository;
    @Autowired
    private InvitationRepository invitationRepository;

    //  팀원 초대
    @Transactional
    public Invitation inviteUserToTeam(Long teamId, Long inviterId, Long invitedUserId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("팀 정보를 찾을 수 없습니다. Team ID: " + teamId));
        User inviter = userRepository.findById(inviterId)
                .orElseThrow(() -> new IllegalArgumentException("초대자 정보를 찾을 수 없습니다. User ID: " + inviterId));
        User invited = userRepository.findById(invitedUserId)
                .orElseThrow(() -> new IllegalArgumentException("초대받을 사용자 정보를 찾을 수 없습니다. User ID: " + invitedUserId));

        // 자기 자신을 초대하는 경우 방지
        if (inviterId.equals(invitedUserId)) {
            throw new IllegalArgumentException("자기 자신을 팀에 초대할 수 없습니다.");
        }

        // 초대자가 해당 팀의 멤버인지 확인 (권한 검사)
         if (!teamMemberRepository.existsByTeam_TeamIdAndUser_UserId(teamId, inviterId)) {
            throw new IllegalStateException("팀 멤버만 다른 사용자를 초대할 수 있습니다.");
         }


        // 이미 해당 팀의 멤버인지 확인
        if (teamMemberRepository.existsByTeam_TeamIdAndUser_UserId(teamId, invitedUserId)) {
            throw new IllegalArgumentException("이미 해당 팀의 멤버입니다. User ID: " + invitedUserId);
        }

        // 이미 PENDING 상태의 초대가 있는지 확인
        Optional<Invitation> existingPendingInvitation = invitationRepository
                .findByTeamAndInvitedUserAndStatus(team, invited, InvitationStatus.PENDING);
        if (existingPendingInvitation.isPresent()) {
            throw new IllegalArgumentException("이미 해당 사용자에게 보류 중인 초대가 있습니다.");
        }

        // 초대 엔티티 생성 및 저장
        Invitation invitation = Invitation.builder()
                .team(team)
                .inviter(inviter)
                .invitedUser(invited)
                .status(InvitationStatus.PENDING)
                .build();
        return invitationRepository.save(invitation);
    }

    //  초대 수락
    @Transactional
    public TeamMember acceptTeamInvitation(Long invitationId, Long actionUserId) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new IllegalArgumentException("초대 정보를 찾을 수 없습니다. Invitation ID: " + invitationId));

        //  초대를 받은 사람 본인이 수락하는지 확인
        if (!invitation.getInvitedUser().getUserId().equals(actionUserId)) {
            throw new IllegalStateException("본인의 초대만 수락할 수 있습니다.");
        }

        //  이미 처리된 초대인지 확인 (PENDING 상태여야 함)
        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new IllegalStateException("이미 처리된 초대입니다. 현재 상태: " + invitation.getStatus());
        }

        //  초대 상태 변경
        invitation.setStatus(InvitationStatus.ACCEPTED);
        invitation.setResponsedAt(LocalDateTime.now());
        invitationRepository.save(invitation);

        //  팀 멤버로 등록
        TeamMember teamMember = TeamMember.builder()
                .team(invitation.getTeam())
                .user(invitation.getInvitedUser())
                .build();
        return teamMemberRepository.save(teamMember);
    }

    //  초대 거절
    @Transactional
    public void rejectTeamInvitation(Long invitationId, Long actionUserId) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new IllegalArgumentException("초대 정보를 찾을 수 없습니다. Invitation ID: " + invitationId));

        //  초대를 받은 사람 본인이 거절하는지 확인
        if (!invitation.getInvitedUser().getUserId().equals(actionUserId)) {
            throw new IllegalStateException("본인의 초대만 거절할 수 있습니다.");
        }

        //  이미 처리된 초대인지 확인 (PENDING 상태여야 함)
        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new IllegalStateException("이미 처리된 초대입니다. 현재 상태: " + invitation.getStatus());
        }

        //  초대 상태 변경
        invitation.setStatus(InvitationStatus.REJECTED);
        invitation.setResponsedAt(LocalDateTime.now());
        invitationRepository.save(invitation);
    }

    //  특정 유저에게 온 모든 초대 조회
    public List<Invitation> getUserInvitations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return invitationRepository.findByInvitedUser(user);
    }

    //  특정 유저에게 온 모든 초대 조회 (PENDING 상태만)
    public List<Invitation> getPendingInvitationsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다. User ID: " + userId));
        return invitationRepository.findByInvitedUserAndStatus(user, InvitationStatus.PENDING);
    }

    //  팀 멤버 목록 조회
    public List<TeamMember> getTeamMembers(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

        return teamMemberRepository.findByTeam(team);
    }

    //  팀원 삭제 1. 팀원이 스스로 나가는 경우
    @Transactional
    public void leaveTeam(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        TeamMember teamMember = teamMemberRepository.findByTeamAndUser(team, user)
                .orElseThrow(() -> new IllegalArgumentException("팀에 속하지 않습니다."));

        teamMemberRepository.delete(teamMember);
    }

    //  팀원 삭제 2. 팀 생성자가 팀원 강퇴
    @Transactional
    public void kickTeamMember(Long teamId, Long targetUserId) {

        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Long currentUserId = userDetails.getUserId();

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

        // 팀 생성자 확인
        if (!team.getUser().getUserId().equals(currentUserId)) {
            throw new IllegalArgumentException("팀 생성자만 강제 퇴장시킬 수 있습니다.");
        }

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        TeamMember teamMember = teamMemberRepository.findByTeamAndUser(team, targetUser)
                .orElseThrow(() -> new IllegalArgumentException("팀에 속하지 않습니다."));

        teamMemberRepository.delete(teamMember);
    }

    //  Spring Security
    public boolean isTeamMember(Long teamId, Long userId) {
        return teamMemberRepository.existsByTeam_TeamIdAndUser_UserId(teamId, userId);
    }

    public boolean isInvitedUser(Long invitationId, Long userId) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new IllegalArgumentException("Invitation not found"));

        return invitation.getInvitedUser().getUserId().equals(userId);
    }
}
