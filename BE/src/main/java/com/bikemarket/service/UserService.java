package com.bikemarket.service;

import com.bikemarket.dto.AdminUserRequest;
import com.bikemarket.dto.UserDTO;
import com.bikemarket.entity.User;
import com.bikemarket.enums.Role;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService implements IUserService {

  @Autowired
  private UserRepository userRepository;

  @Override
  public void saveUser(User user) {
    userRepository.save(user);
  }

  @Override
  public void updateUser(User user) {
    userRepository.save(user);
  }

  @Override
  public User findUserById(long id) {
    return userRepository.findById(id).orElse(null);
  }

  @Override
  public User findUserByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  @Override
  public void deleteUser(User user) {
    userRepository.delete(user);
  }

  @Override
  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  public List<UserDTO> getAdminUsers(Role role) {
    return userRepository.findAll()
        .stream()
        .filter(user -> role == null || user.getRole() == role)
        .sorted(Comparator.comparing(User::getId))
        .map(this::mapToDTO)
        .collect(Collectors.toList());
  }

  public UserDTO createAdminUser(AdminUserRequest request) {
    validateAdminUserRequest(request, true);

    if (userRepository.findByEmail(request.getEmail().trim()) != null) {
      throw new IllegalArgumentException("Email đã tồn tại");
    }

    User user = new User(
        request.getName().trim(),
        request.getEmail().trim(),
        trimToEmpty(request.getPhone()),
        request.getPassword(),
        request.getRole()
    );

    return mapToDTO(userRepository.save(user));
  }

  public UserDTO updateAdminUser(Long userId, AdminUserRequest request) {
    validateAdminUserRequest(request, false);

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

    User duplicatedEmailUser = userRepository.findByEmail(request.getEmail().trim());
    if (duplicatedEmailUser != null && duplicatedEmailUser.getId() != user.getId()) {
      throw new IllegalArgumentException("Email đã tồn tại");
    }

    user.setName(request.getName().trim());
    user.setEmail(request.getEmail().trim());
    user.setPhone(trimToEmpty(request.getPhone()));
    user.setRole(request.getRole());
    if (request.getPassword() != null && !request.getPassword().isBlank()) {
      user.setPassword(request.getPassword());
    }

    return mapToDTO(userRepository.save(user));
  }

  public void deleteUserById(Long userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
    userRepository.delete(user);
  }

  private void validateAdminUserRequest(AdminUserRequest request, boolean requirePassword) {
    if (request == null) {
      throw new IllegalArgumentException("Thông tin user không được để trống");
    }
    if (request.getName() == null || request.getName().isBlank()) {
      throw new IllegalArgumentException("Tên user không được để trống");
    }
    if (request.getEmail() == null || request.getEmail().isBlank()) {
      throw new IllegalArgumentException("Email không được để trống");
    }
    if (request.getRole() == null) {
      throw new IllegalArgumentException("Role không được để trống");
    }
    if (requirePassword && (request.getPassword() == null || request.getPassword().isBlank())) {
      throw new IllegalArgumentException("Mật khẩu không được để trống");
    }
  }

  private UserDTO mapToDTO(User user) {
    return UserDTO.builder()
        .id(user.getId())
        .name(user.getName())
        .email(user.getEmail())
        .phone(user.getPhone())
        .role(user.getRole())
        .createdAt(user.getCreated_at())
        .build();
  }

  private String trimToEmpty(String value) {
    return value == null ? "" : value.trim();
  }
}
