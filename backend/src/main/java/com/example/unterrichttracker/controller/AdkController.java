package com.example.unterrichttracker.controller;

import com.example.unterrichttracker.model.AdkProgress;
import com.example.unterrichttracker.model.Student;
import com.example.unterrichttracker.repository.AdkProgressRepository;
import com.example.unterrichttracker.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/adk")
@CrossOrigin
public class AdkController {

    private final AdkProgressRepository repo;
    private final StudentRepository studentRepo;

    public AdkController(AdkProgressRepository repo, StudentRepository studentRepo) {
        this.repo = repo;
        this.studentRepo = studentRepo;
    }

    // GET /api/adk/{studentId}
    // -> { "grundstufe.sitz_einstellen": true, "aufbaustufe.bremsen": false, ... }
    @GetMapping("/{studentId}")
    public ResponseEntity<Map<String, Boolean>> getAll(@PathVariable UUID studentId) {
        if (!studentRepo.existsById(studentId)) return ResponseEntity.notFound().build();

        Map<String, Boolean> out = new HashMap<>();
        for (AdkProgress p : repo.findByStudent_Id(studentId)) {
            out.put(p.getItemKey(), p.isCompleted());
        }
        return ResponseEntity.ok(out);
    }

    // PUT /api/adk/{studentId}/{itemKey}
    // body: { "completed": true }
    @PutMapping("/{studentId}/{itemKey}")
    public ResponseEntity<Map<String, Object>> setOne(
            @PathVariable UUID studentId,
            @PathVariable String itemKey,
            @RequestBody Map<String, Object> body
    ) {
        Object c = body.get("completed");
        if (c == null) return ResponseEntity.badRequest().build();

        boolean completed = (c instanceof Boolean) ? (Boolean) c : Boolean.parseBoolean(c.toString());

        Student student = studentRepo.findById(studentId).orElse(null);
        if (student == null) return ResponseEntity.notFound().build();

        AdkProgress p = repo.findByStudent_IdAndItemKey(studentId, itemKey)
                .orElseGet(() -> new AdkProgress(student, itemKey, completed));

        p.setStudent(student);
        p.setItemKey(itemKey);
        p.setCompleted(completed);
        p.setUpdatedAt(Instant.now());

        repo.save(p);

        return ResponseEntity.ok(Map.of(
                "studentId", studentId.toString(),
                "itemKey", itemKey,
                "completed", completed
        ));
    }
}
