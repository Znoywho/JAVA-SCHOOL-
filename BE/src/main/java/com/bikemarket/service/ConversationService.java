package com.bikemarket.service;

import com.bikemarket.entity.Conversation;
import com.bikemarket.entity.User;
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
        User user1 = userService.findUserById(userId1);
        if (user1 == null) {
            throw new ResourceNotFoundException("User not found with id: " + userId1);
        }

        User user2 = userService.findUserById(userId2);
        if (user2 == null) {
            throw new ResourceNotFoundException("User not found with id: " + userId2);
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
        return conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + conversationId));
    }

    @Override
    public void deleteConversation(long conversationId) {
        Conversation conversation = getConversationById(conversationId);
        conversationRepository.delete(conversation);
    }
}
