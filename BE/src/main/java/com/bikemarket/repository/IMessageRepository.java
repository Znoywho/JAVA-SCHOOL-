package com.bikemarket.repository;

import com.bikemarket.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IMessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m JOIN FETCH m.sender WHERE m.conversation.id = :conversationId ORDER BY m.createdAt DESC")
    List<Message> findByConversationIdOrderByCreatedAtDesc(@Param("conversationId") long conversationId);

    @Query("SELECT m FROM Message m JOIN FETCH m.sender WHERE m.conversation.id = :conversationId ORDER BY m.createdAt ASC")
    List<Message> findByConversationIdOrderByCreatedAtAsc(@Param("conversationId") long conversationId);
    
    //@Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId AND m.createdAt >= CURRENT_TIMESTAMP - INTERVAL 30 DAY")
    //List<Message> findRecentMessages(@Param("conversationId") long conversationId);
    // sửa lại cho phù hợp vs jpql
    //@Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId AND m.createdAt >= :time")
//List<Message> findRecentMessages(@Param("conversationId") long conversationId,
                                // @Param("time") LocalDateTime time);
    
    long countByConversationId(long conversationId);
}
