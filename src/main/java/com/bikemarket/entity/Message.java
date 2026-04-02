package com.bikemarket.enums;

package com.bikemarket.entity;

import com.bikemarket.enums.Role;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Messages")
class Message {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "ConversationId", nullable = false, foreignKey = @ForeignKey(name = "ConversationId"))
private Conversation conversation;

  @Column(name = "content", nullable = false)
  private String content;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime created_at;

  Message(Conversation conversation, String content) {
    this.conversation = conversation;
    this.content = content;
    this.created_at = LocalDateTime.now();
  }
}