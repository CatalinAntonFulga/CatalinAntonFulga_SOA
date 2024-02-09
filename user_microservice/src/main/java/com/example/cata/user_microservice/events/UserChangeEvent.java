package com.example.cata.user_microservice.events;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@NoArgsConstructor
@Getter
@Setter
public class UserChangeEvent implements Serializable {
    private String username;
    private String password;
    private String email;

    public UserChangeEvent(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }
}
