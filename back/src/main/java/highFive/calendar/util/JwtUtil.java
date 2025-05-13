package highFive.calendar.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;  //  토큰 서명용 비밀키

    @Value("${jwt.expiration}")
    private Long expiration;    //  토큰 유효기간(ms)

    //  JWT 토큰 생성 메서드
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)  //  사용자 식별
                .setIssuedAt((new Date()))  //  토큰 발급 기간
                .setExpiration(new Date(System.currentTimeMillis() + expiration))   //  만료 시간
                .signWith(SignatureAlgorithm.HS512, secret) //  암호화 알고리즘
                .compact(); //  토큰 생성
    }

    //  토큰에서 사용자 정보 추출
    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(secret)  //  서명 키 설정
                .parseClaimsJws(token)  //  토큰 파싱
                .getBody()
                .getSubject();  //  사용자 email 추출
    }
}
