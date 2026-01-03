package com.example.unterrichttracker.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.unterrichttracker.model.Lesson;
import java.util.UUID;

public interface LessonRepository extends JpaRepository<Lesson, UUID> {}
