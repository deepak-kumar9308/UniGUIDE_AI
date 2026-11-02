package com.uniguideAI.controller;

import com.uniguideAI.dto.ScholarshipResponse;
import com.uniguideAI.entity.Scholarship;
import com.uniguideAI.service.ScholarshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/scholarships")
@RequiredArgsConstructor
public class ScholarshipController {

    private final ScholarshipService scholarshipService;

    @GetMapping
    public ResponseEntity<List<ScholarshipResponse>> getAllScholarships() {
        return ResponseEntity.ok(scholarshipService.getAllScholarships());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScholarshipResponse> getScholarshipById(@PathVariable Long id) {
        return ResponseEntity.ok(scholarshipService.getScholarshipById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ScholarshipResponse>> searchScholarships(@RequestParam String keyword) {
        return ResponseEntity.ok(scholarshipService.searchScholarships(keyword));
    }

    @GetMapping("/match/{studentId}")
    public ResponseEntity<List<Map<String, Object>>> getMatchingScholarships(@PathVariable Long studentId) {
        return ResponseEntity.ok(scholarshipService.getMatchingScholarshipsForStudent(studentId));
    }

    @PostMapping
    public ResponseEntity<Scholarship> createScholarship(@RequestBody Scholarship scholarship) {
        return new ResponseEntity<>(scholarshipService.createScholarship(scholarship), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Scholarship> updateScholarship(@PathVariable Long id, @RequestBody Scholarship scholarship) {
        return ResponseEntity.ok(scholarshipService.updateScholarship(id, scholarship));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScholarship(@PathVariable Long id) {
        scholarshipService.deleteScholarship(id);
        return ResponseEntity.noContent().build();
    }
}
