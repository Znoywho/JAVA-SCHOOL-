package com.bikemarket.service;

import com.bikemarket.entity.Conversation;
import com.bikemarket.entity.User;
import com.bikemarket.enums.Role;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.repository.IConversationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ConversationService implements IConversationService {

    @Autowired
    private IConversationRepository conversationRepository;

    @Autowired
    private UserService userService;

    @Override
    public Conversation createConversation(long userId1, long userId2) {
        if (userId1 == userId2) {
            throw new IllegalArgumentException("Cannot create a conversation with the same user");
        }

        User user1 = userService.findUserById(userId1);
        if (user1 == null) {
            throw new ResourceNotFoundException("User not found with id: " + userId1);
        }

        User user2 = userService.findUserById(userId2);
        if (user2 == null) {
            throw new ResourceNotFoundException("User not found with id: " + userId2);
        }

        if (!isAllowedChatPair(user1.getRole(), user2.getRole())) {
            throw new IllegalArgumentException("Chat is only available between buyer-seller or buyer-inspector");
        }

        // Check if conversation already exists
        Optional<Conversation> existing = conversationRepository.findConversationBetweenUsers(userId1, userId2);
        if (existing.isPresent()) {
            return existing.get();
        }

        Conversation conversation = new Conversation(user1, user2);
        return conversationRepository.save(conversation);
    }

    @Override
    public Optional<Conversation> getConversationBetweenUsers(long userId1, long userId2) {
        return conversationRepository.findConversationBetweenUsers(userId1, userId2);
    }

    @Override
    public List<Conversation> getConversationsByUserId(long userId) {
        User user = userService.findUserById(userId);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return conversationRepository.findByUserId(userId);
    }

    @Override
    public Conversation getConversationById(long conversationId) {
        return conversationRepository.findDetailedById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + conversationId));
    }

    @Override
    public void deleteConversation(long conversationId) {
        Conversation conversation = getConversationById(conversationId);
        conversationRepository.delete(conversation);
    }

    private boolean isAllowedChatPair(Role role1, Role role2) {
        return (role1 == Role.BUYER && (role2 == Role.SELLER || role2 == Role.INSPECTOR))
                || (role2 == Role.BUYER && (role1 == Role.SELLER || role1 == Role.INSPECTOR));
    }
}
