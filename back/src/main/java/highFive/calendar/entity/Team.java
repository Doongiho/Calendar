package highFive.calendar.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.CreatedDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "team")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Team {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long teamId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(
            name = "fk_team_creator",
            foreignKeyDefinition = "FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;  //  팀 생성자

    @Column(length = 30, nullable = false)
    private String teamName;

    @Column(length = 100, nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TeamMember> teamMembers = new ArrayList<>();    //  1 팀 M 팀 멤버

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<TeamSchedule> teamSchedules = new ArrayList<>();   //  1 팀 M 팀 스케쥴

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Invitation> invitations = new ArrayList<>();   //  1 팀 M 초대

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();    //  타임스탬프 설정
    }
}
