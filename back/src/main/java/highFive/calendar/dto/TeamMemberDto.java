package highFive.calendar.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class TeamMemberDto {

    private Long teamMemberId;
    private Long teamId;
    private Long userId;
    private String userName;
    private String userEmail;
    private LocalDateTime joinedAt;

}
