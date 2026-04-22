package com.bikemarket.dto;

import com.bikemarket.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class NotificationDTO {
    private long id;
    private long userId;
    private NotificationType type;
    private String title;
    private String message;
    private boolean isRead;
    private Long referenceId;
    private LocalDateTime createdAt;
}
