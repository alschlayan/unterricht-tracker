package com.example.unterrichttracker.controller;

import com.example.unterrichttracker.model.Student;
import com.example.unterrichttracker.repository.StudentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/students")
@CrossOrigin
public class StudentController {

    private final StudentRepository repo;

    public StudentController(StudentRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Student> all() {
        return repo.findAll();
    }

    @PostMapping
    public Student create(@RequestBody Student s) {
        return repo.save(s);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        repo.deleteById(id);
    }
}

