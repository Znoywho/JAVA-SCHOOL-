
package com.bikemarket.entity;

import com.bikemarket.enums.Role;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Conversations")
public class Conversation {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "UserId1", nullable = false, foreignKey = @ForeignKey(name = "UserId1"))
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "UserId2", nullable = false, foreignKey = @ForeignKey(name = "UserId2"))
  private User user2;

  public Conversation(User user) {
    this.user = user;
  }
}
