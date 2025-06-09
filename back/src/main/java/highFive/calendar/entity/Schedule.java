package highFive.calendar.entity;

import highFive.calendar.enums.ScheduleColor;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scheduleId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_schedule_user", foreignKeyDefinition = "FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    private ScheduleColor color;
}
