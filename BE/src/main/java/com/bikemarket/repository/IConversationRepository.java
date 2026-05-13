package com.bikemarket.repository;

import com.bikemarket.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IConversationRepository extends JpaRepository<Conversation, Long> {
    @Query("SELECT c FROM Conversation c JOIN FETCH c.user JOIN FETCH c.user2 WHERE (c.user.id = :userId OR c.user2.id = :userId) ORDER BY c.updatedAt DESC, c.createdAt DESC")
    List<Conversation> findByUserId(@Param("userId") long userId);
    
    @Query("SELECT c FROM Conversation c JOIN FETCH c.user JOIN FETCH c.user2 WHERE (c.user.id = :userId1 AND c.user2.id = :userId2) OR (c.user.id = :userId2 AND c.user2.id = :userId1)")
    Optional<Conversation> findConversationBetweenUsers(@Param("userId1") long userId1, @Param("userId2") long userId2);

    @Query("SELECT c FROM Conversation c JOIN FETCH c.user JOIN FETCH c.user2 WHERE c.id = :conversationId")
    Optional<Conversation> findDetailedById(@Param("conversationId") long conversationId);
}
