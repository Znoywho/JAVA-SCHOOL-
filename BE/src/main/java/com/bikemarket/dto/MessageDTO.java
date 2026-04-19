package com.bikemarket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class MessageDTO {
    private long id;
    private long conversationId;
    private long senderId;
    private String senderName;
    private String content;
    private LocalDateTime createdAt;
}
