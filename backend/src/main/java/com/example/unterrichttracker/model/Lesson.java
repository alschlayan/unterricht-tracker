package com.example.unterrichttracker.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
public class Lesson {

    @Id
    @GeneratedValue
    private UUID id;

    private LocalDate date;

    // ✅ neu: Startzeit (optional)
    private LocalTime startTime;

    private int durationMinutes;

    @ManyToOne(optional = true)
    private Student student;

    public Lesson() {}

    public UUID getId() { return id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
}
