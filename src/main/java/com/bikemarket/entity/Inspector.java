package com.bikemarket.entity;

import com.bikemarket.enums.Role;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// NOTE: Buyer inherits from User by joining the `TABLE`
public class Inspector extends User {
  // NOTE: `CascadeType.ALl` -> include cascade persist + cascade merge + cascade
  // remove
  // WARNING: `CascadeType.ALl`: removing inspector report that can also remove
  // inspector
  @OneToMany(mappedBy = "inspectorReport")
  List<InspectorReport> inspectorReports;

  public Inspector(String name, String email, String phone, String password) {
    super(name, email, phone, password, Role.INSPECTOR);
    this.inspectorReports = null;
  }

}
