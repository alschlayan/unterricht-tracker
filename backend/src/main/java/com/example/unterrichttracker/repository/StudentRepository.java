package com.example.unterrichttracker.repository;

import com.example.unterrichttracker.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface StudentRepository extends JpaRepository<Student, UUID> {}

