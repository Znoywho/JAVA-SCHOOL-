package com.bikemarket.service;

import com.bikemarket.entity.Notification;
import com.bikemarket.enums.NotificationType;
import java.util.List;
import java.util.Optional;

public interface INotificationService {
    Notification createNotification(long userId, NotificationType type, String title, String message, Long referenceId);
    
    Optional<Notification> getNotificationById(long notificationId);
    
    List<Notification> getNotificationsByUserId(long userId);
    
    List<Notification> getUnreadNotificationsByUserId(long userId);
    
    List<Notification> getNotificationsByUserIdAndType(long userId, NotificationType type);
    
    Notification markAsRead(long notificationId);
    
    void markAllAsRead(long userId);
    
    void deleteNotification(long userId, long notificationId);
    
    void deleteAllNotifications(long userId);
    
    long getUnreadCount(long userId);
}
