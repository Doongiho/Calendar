package highFive.calendar.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret; // 토큰 서명용 비밀키

    @Value("${jwt.expiration}")
    private Long expiration; // 토큰 유효기간(ms)

    // JWT 토큰 생성 메서드
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email) // 사용자 식별
                .setIssuedAt((new Date())) // 토큰 발급 기간
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // 만료 시간
                .signWith(SignatureAlgorithm.HS512, secret) // 암호화 알고리즘
                .compact(); // 토큰 생성
    }

    // 토큰에서 사용자 정보 추출
    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(secret) // 서명 키 설정
                .parseClaimsJws(token) // 토큰 파싱
                .getBody()
                .getSubject(); // 사용자 email 추출
    }

    public String getUsernameFromToken(String token) {
        return getEmailFromToken(token);
    }
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    public Authentication getAuthentication(String token) {
        String username = getUsernameFromToken(token);

        // 실제로는 DB 조회해서 권한 정보 가져와야 하지만
        // 임시로 ROLE_USER 권한만 부여
        List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));

        return new UsernamePasswordAuthenticationToken(username, null, authorities);
    }
}
