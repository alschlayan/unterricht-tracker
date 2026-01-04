package com.example.unterrichttracker.controller;

import com.example.unterrichttracker.model.AppSetting;
import com.example.unterrichttracker.repository.AppSettingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin
public class SettingsController {

    private static final String KEY_MONTH_TARGET_UE = "monthTargetUE";
    private static final int DEFAULT_MONTH_TARGET_UE = 80;

    private final AppSettingRepository repo;

    public SettingsController(AppSettingRepository repo) {
        this.repo = repo;
    }

    // GET /api/settings/month-target-ue  -> { "value": 80 }
    @GetMapping("/month-target-ue")
    public Map<String, Integer> getMonthTargetUE() {
        int value = repo.findById(KEY_MONTH_TARGET_UE)
                .map(s -> {
                    try { return Integer.parseInt(s.getValue()); }
                    catch (Exception e) { return DEFAULT_MONTH_TARGET_UE; }
                })
                .orElse(DEFAULT_MONTH_TARGET_UE);

        return Map.of("value", value);
    }

    // PUT /api/settings/month-target-ue  body: { "value": 100 }
    @PutMapping("/month-target-ue")
    public ResponseEntity<Map<String, Integer>> setMonthTargetUE(@RequestBody Map<String, Object> body) {
        Object v = body.get("value");
        if (v == null) return ResponseEntity.badRequest().build();

        int parsed;
        try {
            parsed = (v instanceof Number) ? ((Number) v).intValue() : Integer.parseInt(v.toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

        if (parsed < 0) parsed = 0;

        repo.save(new AppSetting(KEY_MONTH_TARGET_UE, String.valueOf(parsed)));
        return ResponseEntity.ok(Map.of("value", parsed));
    }
}
