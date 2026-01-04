package com.example.unterrichttracker.repository;

import com.example.unterrichttracker.model.AdkProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AdkProgressRepository extends JpaRepository<AdkProgress, UUID> {
    List<AdkProgress> findByStudent_Id(UUID studentId);
    Optional<AdkProgress> findByStudent_IdAndItemKey(UUID studentId, String itemKey);
}
