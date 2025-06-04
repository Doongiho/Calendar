package highFive.calendar.entity;

import highFive.calendar.enums.InvitationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "team_id", nullable = false, foreignKey = @ForeignKey(
            name = "fk_invitation_team",
            foreignKeyDefinition = "FOREIGN KEY(team_id) REFERENCES team(team_id) ON DELETE CASCADE"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "inviter_id", nullable = false, foreignKey = @ForeignKey(
            name = "fk_invitation_inviter",
            foreignKeyDefinition = "FOREIGN KEY(inviter_id) REFERENCES users(user_id) ON DELETE CASCADE"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User inviter;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "invited_id", nullable = false, foreignKey = @ForeignKey(
            name = "fk_invitation_invited",
            foreignKeyDefinition = "FOREIGN KEY(invited_id) REFERENCES users(user_id) ON DELETE CASCADE"))
    @OnDelete(action = OnDeleteAction.CASCADE)
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
