package com.bikemarket.controller;

import com.bikemarket.dto.ApiResponse;
import com.bikemarket.dto.NotificationDTO;
import com.bikemarket.entity.Notification;
import com.bikemarket.enums.NotificationType;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.service.INotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private INotificationService notificationService;

    /**
     * Get all notifications for a user
     * GET /api/notifications/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getNotifications(
            @PathVariable long userId) {
        try {
            List<Notification> notifications = notificationService.getNotificationsByUserId(userId);
            List<NotificationDTO> dtoList = notifications.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ApiResponse.ok(dtoList, "Notifications retrieved successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Get unread notifications for a user
     * GET /api/notifications/{userId}/unread
     */
    @GetMapping("/{userId}/unread")
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getUnreadNotifications(
            @PathVariable long userId) {
        try {
            List<Notification> notifications = notificationService.getUnreadNotificationsByUserId(userId);
            List<NotificationDTO> dtoList = notifications.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ApiResponse.ok(dtoList, "Unread notifications retrieved successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Get unread notification count
     * GET /api/notifications/{userId}/unread-count
     */
    @GetMapping("/{userId}/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @PathVariable long userId) {
        try {
            long count = notificationService.getUnreadCount(userId);
            return ResponseEntity.ok(ApiResponse.ok(count, "Unread count retrieved successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Get notifications by type
     * GET /api/notifications/{userId}/type/{type}
     */
    @GetMapping("/{userId}/type/{type}")
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getNotificationsByType(
            @PathVariable long userId,
            @PathVariable String type) {
        try {
            NotificationType notificationType = NotificationType.valueOf(type.toUpperCase());
            List<Notification> notifications = notificationService.getNotificationsByUserIdAndType(userId, notificationType);
            List<NotificationDTO> dtoList = notifications.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ApiResponse.ok(dtoList, "Notifications retrieved successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Bad Request", "Invalid notification type: " + type));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Get notification by ID
     * GET /api/notifications/detail/{notificationId}
     */
    @GetMapping("/detail/{notificationId}")
    public ResponseEntity<ApiResponse<NotificationDTO>> getNotificationById(
            @PathVariable long notificationId) {
        try {
            Notification notification = notificationService.getNotificationById(notificationId)
                    .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));
            NotificationDTO dto = convertToDTO(notification);
            return ResponseEntity.ok(ApiResponse.ok(dto, "Notification retrieved successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Mark notification as read
     * PUT /api/notifications/{notificationId}/read
     */
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<NotificationDTO>> markAsRead(
            @PathVariable long notificationId) {
        try {
            Notification notification = notificationService.markAsRead(notificationId);
            NotificationDTO dto = convertToDTO(notification);
            return ResponseEntity.ok(ApiResponse.ok(dto, "Notification marked as read"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Mark all notifications as read
     * PUT /api/notifications/{userId}/read-all
     */
    @PutMapping("/{userId}/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @PathVariable long userId) {
        try {
            notificationService.markAllAsRead(userId);
            return ResponseEntity.ok(ApiResponse.ok(null, "All notifications marked as read"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Delete notification
     * DELETE /api/notifications/{userId}/{notificationId}
     */
    @DeleteMapping("/{userId}/{notificationId}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @PathVariable long userId,
            @PathVariable long notificationId) {
        try {
            notificationService.deleteNotification(userId, notificationId);
            return ResponseEntity.ok(ApiResponse.ok(null, "Notification deleted successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Delete all notifications
     * DELETE /api/notifications/{userId}/delete-all
     */
    @DeleteMapping("/{userId}/delete-all")
    public ResponseEntity<ApiResponse<Void>> deleteAllNotifications(
            @PathVariable long userId) {
        try {
            notificationService.deleteAllNotifications(userId);
            return ResponseEntity.ok(ApiResponse.ok(null, "All notifications deleted successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    // Helper method
    private NotificationDTO convertToDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .userId(notification.getUser().getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.isRead())
                .referenceId(notification.getReferenceId())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
