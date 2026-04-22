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
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + conversationId));

        User sender = userService.findUserById(senderId);
        if (sender == null) {
            throw new ResourceNotFoundException("Sender not found with id: " + senderId);
        }

        Message message = new Message(conversation, sender, content);
        return messageRepository.save(message);
    }

    @Override
    public List<Message> getMessagesByConversation(long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + conversationId));

        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }

    @Override
    public List<Message> getRecentMessagesByConversation(long conversationId, int limit) {
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
