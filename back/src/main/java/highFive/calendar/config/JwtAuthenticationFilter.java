package highFive.calendar.config;

import highFive.calendar.entity.User;
import highFive.calendar.config.CustomUserDetails;
import highFive.calendar.repository.UserRepository;
import highFive.calendar.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

//  JWT 토큰을 검사해서 인증 정보를 SecurityContext 에 넣어주는 필터
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;  //  JWT 관련 유틸리티 클래스

    private final UserRepository userRepository; // ✅ email로 사용자 조회하기 위해 추가

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        //  1. 요청 헤더에서 Authorization 값 추출
        String authHeader = request.getHeader("Authorization");
        String jwt = null;
        String email = null;

        //  2. 헤더가 있고, "Bearer" 로 시작하면 토큰 추출
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);  //  "Bearer" 이후의 토큰 값만 추출

            try {
                email = jwtUtil.getEmailFromToken(jwt); //  토큰에서 email 추출
            } catch (Exception e) {
                //  토큰 파싱 실패 시 예외 처리
                logger.warn("JWT 토큰 파싱 실패: " + e.getMessage());
            }
        }

        //  3. email 이 있고, 아직 인증이 안된 경우
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // ✅ email로 사용자 조회
            Optional<User> userOptional = userRepository.findByEmail(email);

            if (userOptional.isPresent()) {
                // ✅ CustomUserDetails 로 wrapping
                CustomUserDetails userDetails = new CustomUserDetails(userOptional.get());

                //  4. 토큰이 유효한지 검사 (간단하게 email 추출만으로 인증)
                //  5. 인증 객체 생성 및 SecurityContext 에 저장
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        //  6. 다음 필터로 요청 전달
        filterChain.doFilter(request, response);
    }
}
