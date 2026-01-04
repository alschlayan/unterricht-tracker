package com.example.unterrichttracker.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "itemKey"})
)
public class AdkProgress {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    private Student student;

    @Column(nullable = false)
    private String itemKey;

    @Column(nullable = false)
    private boolean completed;

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    public AdkProgress() {}

    public AdkProgress(Student student, String itemKey, boolean completed) {
        this.student = student;
        this.itemKey = itemKey;
        this.completed = completed;
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public String getItemKey() { return itemKey; }
    public void setItemKey(String itemKey) { this.itemKey = itemKey; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
