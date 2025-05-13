package highFive.calendar.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder

public class ApiResponse<T> {
    private T data;
    private String message;
    private String token;   //  JWT 토큰 응답 필드 추가
}
