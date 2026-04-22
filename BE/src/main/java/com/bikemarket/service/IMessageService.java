package com.bikemarket.service;

import com.bikemarket.entity.Message;
import java.util.List;

public interface IMessageService {
    Message sendMessage(long conversationId, long senderId, String content);
    
    List<Message> getMessagesByConversation(long conversationId);
    
    List<Message> getRecentMessagesByConversation(long conversationId, int limit);
    
    Message getMessageById(long messageId);
    
    void deleteMessage(long messageId);
    
    long getMessageCountByConversation(long conversationId);
}
