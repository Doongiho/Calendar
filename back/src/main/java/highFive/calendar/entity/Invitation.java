package highFive.calendar.entity;

import highFive.calendar.enums.InvitationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "invitation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long invitationsId;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne
    @JoinColumn(name = "inviter_id", nullable = false)
    private User inviter;

    @ManyToOne
    @JoinColumn(name = "invited_id", nullable = false)
    private User invitedUser;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private InvitationStatus status;

    @Column(nullable = false)
    private LocalDateTime sentAt;

    @Column
    private LocalDateTime responsedAt;

    @PrePersist
    protected void onCreate() {
        sentAt = LocalDateTime.now();   //  타임스탬프 설정
        if (this.status == null) {
            this.status = InvitationStatus.PENDING; //  기본 상태를 PENDING 으로 설정
        }
    }


}
