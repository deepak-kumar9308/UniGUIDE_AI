package com.uniguideAI.controller;

import com.uniguideAI.entity.RecommendationHistory;
import com.uniguideAI.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<RecommendationHistory>> getStudentRecommendations(@PathVariable Long studentId) {
        return ResponseEntity.ok(recommendationService.getRecommendationsForStudent(studentId));
    }

    @PostMapping("/generate/{studentId}")
    public ResponseEntity<Map<String, Object>> generateRecommendations(@PathVariable Long studentId) {
        return ResponseEntity.ok(recommendationService.generateRecommendationsForStudent(studentId));
    }
}
