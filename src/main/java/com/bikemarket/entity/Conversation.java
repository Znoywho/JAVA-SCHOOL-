
package com.bikemarket.entity;


import jakarta.persistence.*;



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

  @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Message> messages;

  public Conversation(User user1, User user2) {
    this.user = user1;
    this.user2 = user2;
    this.messages = new ArrayList<>();
  }
}
