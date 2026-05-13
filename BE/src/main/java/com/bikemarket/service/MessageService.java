package com.bikemarket.service;

import com.bikemarket.entity.Conversation;
import com.bikemarket.entity.Message;
import com.bikemarket.entity.User;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.repository.IConversationRepository;
import com.bikemarket.repository.IMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class MessageService implements IMessageService {

    @Autowired
    private IMessageRepository messageRepository;

    @Autowired
    private IConversationRepository conversationRepository;

    @Autowired
    private UserService userService;

    @Override
    public Message sendMessage(long conversationId, long senderId, String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be empty");
        }

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + conversationId));

        User sender = userService.findUserById(senderId);
        if (sender == null) {
            throw new ResourceNotFoundException("Sender not found with id: " + senderId);
        }

        boolean isParticipant = conversation.getUser().getId() == senderId || conversation.getUser2().getId() == senderId;
        if (!isParticipant) {
            throw new IllegalArgumentException("Sender is not a participant in this conversation");
        }

        Message message = new Message(conversation, sender, content.trim());
        Message savedMessage = messageRepository.save(message);
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);
        return savedMessage;
    }

    @Override
    public List<Message> getMessagesByConversation(long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + conversationId));

        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }

    @Override
    public List<Message> getRecentMessagesByConversation(long conversationId, int limit) {
        conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + conversationId));

        List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtDesc(conversationId);
        return messages.stream().limit(limit).toList();
    }

    @Override
    public Message getMessageById(long messageId) {
        return messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with id: " + messageId));
    }

    @Override
    public void deleteMessage(long messageId) {
        Message message = getMessageById(messageId);
        messageRepository.delete(message);
    }

    @Override
    public long getMessageCountByConversation(long conversationId) {
        return messageRepository.countByConversationId(conversationId);
    }
}
