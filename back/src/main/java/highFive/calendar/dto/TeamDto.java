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

public class TeamDto {

    private Long teamId;
    private String teamName;
    private String description; //  team 설명
    private LocalDateTime createdAt;    //  team 생성 일자

    private Long userId;    // team 만든 사람의 id
    private String userEmail;   // team 만든 사람의 이메일
    private String userName;    //  team 만든 사람의 이름


}
