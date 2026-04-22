package com.bikemarket.controller;

import com.bikemarket.dto.ApiResponse;
import com.bikemarket.dto.ConversationDTO;
import com.bikemarket.dto.MessageDTO;
import com.bikemarket.dto.SendMessageDTO;
import com.bikemarket.entity.Conversation;
import com.bikemarket.entity.Message;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.service.IConversationService;
import com.bikemarket.service.IMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private IConversationService conversationService;

    @Autowired
    private IMessageService messageService;

    /**
     * Create or get conversation between two users
     * POST /api/chat/conversation/{userId1}/{userId2}
     */
    @PostMapping("/conversation/{userId1}/{userId2}")
    public ResponseEntity<ApiResponse<ConversationDTO>> createConversation(
            @PathVariable long userId1,
            @PathVariable long userId2) {
        try {
            Conversation conversation = conversationService.createConversation(userId1, userId2);
            ConversationDTO dto = convertToDTO(conversation);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok(dto, "Conversation created/retrieved successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Get all conversations for a user
     * GET /api/chat/conversations/{userId}
     */
    @GetMapping("/conversations/{userId}")
    public ResponseEntity<ApiResponse<List<ConversationDTO>>> getUserConversations(
            @PathVariable long userId) {
        try {
            List<Conversation> conversations = conversationService.getConversationsByUserId(userId);
            List<ConversationDTO> dtoList = conversations.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ApiResponse.ok(dtoList, "Conversations retrieved successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Get conversation by ID
     * GET /api/chat/conversation/{conversationId}
     */
    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<ApiResponse<ConversationDTO>> getConversation(
            @PathVariable long conversationId) {
        try {
            Conversation conversation = conversationService.getConversationById(conversationId);
            ConversationDTO dto = convertToDTO(conversation);
            return ResponseEntity.ok(ApiResponse.ok(dto, "Conversation retrieved successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Send message
     * POST /api/chat/{conversationId}/send/{senderId}
     */
    @PostMapping("/{conversationId}/send/{senderId}")
    public ResponseEntity<ApiResponse<MessageDTO>> sendMessage(
            @PathVariable long conversationId,
            @PathVariable long senderId,
            @RequestBody SendMessageDTO sendMessageDTO) {
        try {
            Message message = messageService.sendMessage(conversationId, senderId, sendMessageDTO.getContent());
            MessageDTO dto = convertMessageToDTO(message);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok(dto, "Message sent successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Get all messages in conversation
     * GET /api/chat/{conversationId}/messages
     */
    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<ApiResponse<List<MessageDTO>>> getMessages(
            @PathVariable long conversationId) {
        try {
            List<Message> messages = messageService.getMessagesByConversation(conversationId);
            List<MessageDTO> dtoList = messages.stream()
                    .map(this::convertMessageToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ApiResponse.ok(dtoList, "Messages retrieved successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Get recent messages in conversation
     * GET /api/chat/{conversationId}/messages/recent?limit=20
     */
    @GetMapping("/{conversationId}/messages/recent")
    public ResponseEntity<ApiResponse<List<MessageDTO>>> getRecentMessages(
            @PathVariable long conversationId,
            @RequestParam(defaultValue = "20") int limit) {
        try {
            List<Message> messages = messageService.getRecentMessagesByConversation(conversationId, limit);
            List<MessageDTO> dtoList = messages.stream()
                    .map(this::convertMessageToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ApiResponse.ok(dtoList, "Recent messages retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Bad Request", e.getMessage()));
        }
    }

    /**
     * Delete conversation
     * DELETE /api/chat/conversation/{conversationId}
     */
    @DeleteMapping("/conversation/{conversationId}")
    public ResponseEntity<ApiResponse<Void>> deleteConversation(
            @PathVariable long conversationId) {
        try {
            conversationService.deleteConversation(conversationId);
            return ResponseEntity.ok(ApiResponse.ok(null, "Conversation deleted successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Delete message
     * DELETE /api/chat/message/{messageId}
     */
    @DeleteMapping("/message/{messageId}")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(
            @PathVariable long messageId) {
        try {
            messageService.deleteMessage(messageId);
            return ResponseEntity.ok(ApiResponse.ok(null, "Message deleted successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    // Helper methods
    private ConversationDTO convertToDTO(Conversation conversation) {
        return ConversationDTO.builder()
                .id(conversation.getId())
                .userId1(conversation.getUser().getId())
                .user1Name(conversation.getUser().getName())
                .userId2(conversation.getUser2().getId())
                .user2Name(conversation.getUser2().getName())
                .messageCount(conversation.getMessages() != null ? conversation.getMessages().size() : 0)
                .build();
    }

    private MessageDTO convertMessageToDTO(Message message) {
        return MessageDTO.builder()
                .id(message.getId())
                .conversationId(message.getConversation().getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getName())
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
