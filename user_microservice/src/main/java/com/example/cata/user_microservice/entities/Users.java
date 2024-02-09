package com.example.cata.user_microservice.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(name = "users", uniqueConstraints = {@UniqueConstraint(columnNames = "username")})

public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String username;
    private String password;
    private String email;
    private String role;

    public Users(String username, String password, String email, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.email=email;
    }
}
