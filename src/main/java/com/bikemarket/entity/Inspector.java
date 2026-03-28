package com.bikemarket.entity;

import com.bikemarket.enums.Role;

import javax.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// NOTE: Buyer inherits from User by joining the `TABLE`
@Entity
@Table(name = "inspectors")
@PrimaryKeyJoinColumn(name = "user_id")
public class Inspector extends User {

}
