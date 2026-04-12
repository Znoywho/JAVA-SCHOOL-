package com.bikemarket.service;

import com.bikemarket.entity.User;
import java.util.List;

public interface IUserService {
    public User findUserByEmail(String email);
    public void saveUser(User user);
    public User findUserById(long id);
    public void deleteUser(User user);
    public void updateUser(User user);
    public List<User> getAllUsers();
}
