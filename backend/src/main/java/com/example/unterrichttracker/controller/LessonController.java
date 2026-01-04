package com.example.unterrichttracker.controller;

import com.example.unterrichttracker.model.Lesson;
import com.example.unterrichttracker.repository.LessonRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin
public class LessonController {

    private final LessonRepository repo;

    public LessonController(LessonRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Lesson> all() {
        return repo.findAll();
    }

    @PostMapping
    public Lesson create(@RequestBody Lesson l) {
        return repo.save(l);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lesson> update(@PathVariable UUID id, @RequestBody Lesson incoming) {
        return repo.findById(id)
                .map(existing -> {
                    existing.setDate(incoming.getDate());
                    existing.setDurationMinutes(incoming.getDurationMinutes());
                    existing.setStudent(incoming.getStudent());
                    
                    existing.setAmount(incoming.getAmount());
                    existing.setPaid(incoming.isPaid());
                    existing.setTransferred(incoming.isTransferred());


                    return ResponseEntity.ok(repo.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
