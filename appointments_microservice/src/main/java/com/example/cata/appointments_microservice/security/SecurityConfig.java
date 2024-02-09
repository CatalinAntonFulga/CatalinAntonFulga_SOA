package com.example.cata.appointments_microservice.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;

    public static final String ADMIN = "Admin";
    public static final String PATIENT = "Patient";
    public static final String DOCTOR = "Doctor";

    public SecurityConfig(JwtRequestFilter jwtRequestFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers("/api/appointments").hasAuthority(ADMIN)
                        .requestMatchers("/api/appointments/add").hasAnyAuthority(ADMIN, PATIENT, DOCTOR)
                        .requestMatchers("/api/appointments/by-doctor").hasAnyAuthority(ADMIN, DOCTOR)
                        .requestMatchers("/api/appointments/by-doctor/ordered").hasAnyAuthority(ADMIN, DOCTOR)
                        .requestMatchers("/api/appointments/by-patient").hasAnyAuthority(ADMIN, PATIENT)
                        .requestMatchers("/api/appointments/by-patient/ordered").hasAnyAuthority(ADMIN, PATIENT)
                        .requestMatchers("/api/appointments/ordered").hasAuthority(ADMIN)
                        .requestMatchers("/api/appointments/id").hasAnyAuthority(ADMIN, DOCTOR, PATIENT)
                        .requestMatchers("/api/appointments/update").hasAnyAuthority(ADMIN, DOCTOR, PATIENT)
                        .requestMatchers("api/appointments/delete").hasAnyAuthority(ADMIN, DOCTOR, PATIENT)
                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
                .csrf(AbstractHttpConfigurer::disable);

        return http.build();
    }
}

