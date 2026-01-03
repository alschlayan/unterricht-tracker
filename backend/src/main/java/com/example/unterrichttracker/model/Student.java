package com.example.unterrichttracker.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
public class Student {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;

    private String email;

    public Student() {}

    public UUID getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
