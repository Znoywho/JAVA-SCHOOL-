package com.bikemarket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ConversationDTO {
    private long id;
    private long userId1;
    private String user1Name;
    private long userId2;
    private String user2Name;
    private int messageCount;
    private LocalDateTime lastMessageTime;
    private List<MessageDTO> messages;
}
