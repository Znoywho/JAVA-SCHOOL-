
package com.bikemarket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "Messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ConversationId", nullable = false, foreignKey = @ForeignKey(name = "ConversationId"))
  private Conversation conversation;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "SenderId", nullable = false, foreignKey = @ForeignKey(name = "SenderId"))
  private User sender;

  @Column(name = "content", nullable = false, columnDefinition = "TEXT")
  private String content;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  public Message(Conversation conversation, User sender, String content) {
    this.conversation = conversation;
    this.sender = sender;
    this.content = content;
    this.createdAt = LocalDateTime.now();
  }
}
