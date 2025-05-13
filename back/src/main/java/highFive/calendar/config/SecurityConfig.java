package highFive.calendar.config;

import highFive.calendar.service.UserService;
import highFive.calendar.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity  //  Spring Security 활성화
@EnableMethodSecurity   //  메서드 단위 보안 활성화
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        httpSecurity
                .csrf(csrf -> csrf.disable())   //  REST API 는 CSRF 보호 비활성화
                .cors(Customizer.withDefaults())    //  WebConfig 설정 사용
                .authorizeHttpRequests(auth -> auth.requestMatchers("/","/api/users/register", "/api/users/login").permitAll()   //  인증 없이 접근 허용
                .anyRequest().authenticated()   //  그 외 모든 요청은 인증 필요
                )
                .addFilterBefore(   //  JWT 필터 추가
                        jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class
                );
        return httpSecurity.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}

