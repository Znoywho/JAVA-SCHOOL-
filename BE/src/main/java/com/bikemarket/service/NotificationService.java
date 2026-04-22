package com.bikemarket.service;

import com.bikemarket.entity.Notification;
import com.bikemarket.entity.User;
import com.bikemarket.enums.NotificationType;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.repository.INotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class NotificationService implements INotificationService {

    @Autowired
    private INotificationRepository notificationRepository;

    @Autowired
    private UserService userService;

    @Override
    public Notification createNotification(long userId, NotificationType type, String title, String message, Long referenceId) {
        User user = userService.findUserById(userId);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        Notification notification = new Notification(user, type, title, message, referenceId);
        return notificationRepository.save(notification);
    }

    @Override
    public Optional<Notification> getNotificationById(long notificationId) {
        return notificationRepository.findById(notificationId);
    }

    @Override
    public List<Notification> getNotificationsByUserId(long userId) {
        User user = userService.findUserById(userId);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Notification> getUnreadNotificationsByUserId(long userId) {
        User user = userService.findUserById(userId);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return notificationRepository.findUnreadNotificationsByUserId(userId);
    }

    @Override
    public List<Notification> getNotificationsByUserIdAndType(long userId, NotificationType type) {
        User user = userService.findUserById(userId);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return notificationRepository.findNotificationsByUserAndType(userId, type);
    }

    @Override
    public Notification markAsRead(long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        notification.setRead(true);
        notification.setUpdatedAt(LocalDateTime.now());

        return notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(long userId) {
        User user = userService.findUserById(userId);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        List<Notification> unreadNotifications = getUnreadNotificationsByUserId(userId);
        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
            notification.setUpdatedAt(LocalDateTime.now());
            notificationRepository.save(notification);
        });
    }

    @Override
    public void deleteNotification(long userId, long notificationId) {
        User user = userService.findUserById(userId);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        notificationRepository.deleteByUserIdAndId(userId, notificationId);
    }

    @Override
    public void deleteAllNotifications(long userId) {
        User user = userService.findUserById(userId);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        List<Notification> notifications = getNotificationsByUserId(userId);
        notificationRepository.deleteAll(notifications);
    }

    @Override
    public long getUnreadCount(long userId) {
        User user = userService.findUserById(userId);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return notificationRepository.countUnreadNotificationsByUserId(userId);
    }
}
