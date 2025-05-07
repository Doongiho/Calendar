package highFive.calendar.entity;

import highFive.calendar.enums.ScheduleColor;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
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
