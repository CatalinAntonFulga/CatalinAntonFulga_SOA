package com.example.cata.user_microservice.services;


import com.example.cata.user_microservice.entities.Users;

import java.util.List;
import java.util.Optional;

public interface UsersService {
    List<Users> getAllUsers();

    Optional<Users> getUserByID(Integer id);

    Optional<Users> getUserByName(String username);

    Optional<Users> getUserByRole(String role);

    void createUser(Users user);

    void updateUser(Integer id, Users user);

    void deleteUser(Users user);

    boolean isUsernameValid(String username);

    void changePassword(Users user, String oldPass, String newPass);

    void replaceUsername(Users user, String oldUsername, String newUsername);

    Optional<Users> authenticateUser(String username, String password);
}
