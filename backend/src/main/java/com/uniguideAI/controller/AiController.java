package com.uniguideAI.controller;

import com.uniguideAI.service.AiIntegrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiIntegrationService aiIntegrationService;

    @PostMapping("/predict")
    public ResponseEntity<Map<String, Object>> predictAdmission(
            @RequestParam double marks,
            @RequestParam double entranceScore,
            @RequestParam double budget,
            @RequestParam double cutoff) {
        return ResponseEntity.ok(aiIntegrationService.predictAdmission(marks, entranceScore, budget, cutoff));
    }

    @PostMapping("/recommend")
    public ResponseEntity<Map<String, Object>> getRecommendations(
            @RequestParam Long studentId,
            @RequestParam double marks,
            @RequestParam double budget,
            @RequestParam String preferredCourse,
            @RequestParam String preferredLocation) {
        return ResponseEntity.ok(aiIntegrationService.getRecommendations(studentId, marks, budget, preferredCourse, preferredLocation));
    }
}
