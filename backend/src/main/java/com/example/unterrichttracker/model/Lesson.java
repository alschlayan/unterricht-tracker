package com.example.unterrichttracker.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
public class Lesson {

    @Id
    @GeneratedValue
    private UUID id;

    private LocalDate date;

    private LocalTime startTime;

    private int durationMinutes;

    // ✅ NEU: Betrag + Zahlungsstatus
    @Column(precision = 10, scale = 2)
    private BigDecimal amount;

    private boolean paid;

    private boolean transferred;

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

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public boolean isPaid() { return paid; }
    public void setPaid(boolean paid) { this.paid = paid; }

    public boolean isTransferred() { return transferred; }
    public void setTransferred(boolean transferred) { this.transferred = transferred; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
}
