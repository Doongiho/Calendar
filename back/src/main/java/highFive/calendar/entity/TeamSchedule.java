package highFive.calendar.entity;

import highFive.calendar.enums.ScheduleColor;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "team_schedule")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class TeamSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long teamScheduleId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "team_id", nullable = false, foreignKey = @ForeignKey(
            name = "fk_teamschedule_team",
            foreignKeyDefinition = "FOREIGN KEY(team_id) REFERENCES team(team_id) ON DELETE CASCADE"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(
            name = "fk_teamschedule_user",
            foreignKeyDefinition = "FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE SET NULL"))
    private User user;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    @Column(nullable = false)
    private String title;

    @Column
    private String description;

    @Column
    @Enumerated(EnumType.STRING)
    private ScheduleColor color;

}
