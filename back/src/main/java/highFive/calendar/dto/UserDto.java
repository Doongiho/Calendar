package highFive.calendar.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class UserDto {
    private Long userId;

    private String email;

    private String pwd;

    private String name;

    private int gender;
}
