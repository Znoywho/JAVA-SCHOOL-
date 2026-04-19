package com.bikemarket.service;

import com.bikemarket.entity.Conversation;
import java.util.List;
import java.util.Optional;

public interface IConversationService {
    Conversation createConversation(long userId1, long userId2);
    
    Optional<Conversation> getConversationBetweenUsers(long userId1, long userId2);
    
    List<Conversation> getConversationsByUserId(long userId);
    
    Conversation getConversationById(long conversationId);
    
    void deleteConversation(long conversationId);
}
