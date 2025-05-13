package highFive.calendar.service;


import highFive.calendar.entity.Team;
import highFive.calendar.entity.TeamMember;
import highFive.calendar.entity.User;
import highFive.calendar.repository.TeamMemberRepository;
import highFive.calendar.repository.TeamRepository;
import highFive.calendar.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TeamMemberRepository teamMemberRepository;

    //  팀 생성
    @Transactional
    public Team createTeam(Team team) {
        //  팀 저장
        Team savedTeam = teamRepository.save(team);

        //  팀 생성자를 팀 멤버로 자동 추가
        TeamMember teamMember = TeamMember.builder()
                .team(savedTeam)
                .user(team.getUser())
                .build();
        teamMemberRepository.save(teamMember);

        return savedTeam;
    }

    //  유저가 속한 팀 목록 조회
    public List<Team> getAllTeamsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Team> memberTeams = teamMemberRepository.findByUser(user).stream()
                .map(TeamMember::getTeam)
                .collect(Collectors.toList());

        return  memberTeams;
    }

    //  팀 정보 조회
    public Team getTeamById(Long teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
    }


    //  팀 정보 수정
    @Transactional
    public Team updateTeam(Team team) {
        if(!teamRepository.existsById(team.getTeamId())) {
            throw new IllegalArgumentException("Team not found");
        }
        return  teamRepository.save(team);
    }

    //  팀 삭제
    @Transactional
    public void deleteTeam(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

        //  팀 멤버 먼저 삭제
        teamMemberRepository.deleteAll(teamMemberRepository.findByTeam(team));

        teamRepository.deleteById(teamId);
    }

    //  Spring Security
    public boolean isTeamCreator(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

        return team.getUser().getUserId().equals(userId);
    }
}
