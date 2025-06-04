package highFive.calendar.entity;


import highFive.calendar.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;
import java.util.stream.Collectors;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(length = 30, nullable = false,unique = true)
    private String email;

    @Column(nullable = false)
    private String pwd;

    @Column(length = 20, nullable = false)
    private String name;

    @Column(nullable = false)
    private int gender;

    // 개인 스케줄
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Schedule> schedules = new ArrayList<>();

    // 유저가 생성한 팀 (팀 생성자)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Team> teams = new ArrayList<>();

    // 유저가 보낸 초대
    @OneToMany(mappedBy = "inviter", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Invitation> invitationsSent = new ArrayList<>();

    // 유저가 받은 초대
    @OneToMany(mappedBy = "invitedUser", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Invitation> invitationsReceived = new ArrayList<>();

    // 유저가 팀에 속한 멤버십 정보
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TeamMember> teamMemberships = new ArrayList<>();


    //  사용자 권한 목록 (별도 테이블 생성)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles",
                    joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    private Set<Role> roles = new HashSet<>();

    //  Spring Security 필수 구현 메서드들
    //  사용자 권한 목록 반환
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.name()))
                .collect(Collectors.toList());
    }

    //  이메일을 username 으로 사용
    @Override
    public String getUsername() { return email; }

    @Override
    public String getPassword() { return pwd; }

    //  계정 만료 여부 (true : 만료 안됨)
    @Override
    public boolean isAccountNonExpired() { return  true; }

    //  계정 잠금 여부 (true : 잠금 안됨)
    @Override
    public boolean isAccountNonLocked() { return  true; }

    //  비밀번호 만료 여부 (true : 만료 안됨)
    @Override
    public boolean isCredentialsNonExpired() { return  true; }

    //  계정 활성화 여부 (true : 활성화)
    @Override
    public boolean isEnabled() { return  true; }
}
