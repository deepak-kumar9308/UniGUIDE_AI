package com.uniguideAI.controller;

import com.uniguideAI.dto.CollegeResponse;
import com.uniguideAI.entity.College;
import com.uniguideAI.service.CollegeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colleges")
@RequiredArgsConstructor
public class CollegeController {

    private final CollegeService collegeService;

    @GetMapping
    public ResponseEntity<List<CollegeResponse>> getAllColleges() {
        return ResponseEntity.ok(collegeService.getAllColleges());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CollegeResponse> getCollegeById(@PathVariable Long id) {
        return ResponseEntity.ok(collegeService.getCollegeById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<CollegeResponse>> searchColleges(@RequestParam String keyword) {
        return ResponseEntity.ok(collegeService.searchColleges(keyword));
    }

    @GetMapping("/location/{location}")
    public ResponseEntity<List<CollegeResponse>> getCollegesByLocation(@PathVariable String location) {
        return ResponseEntity.ok(collegeService.filterByLocation(location));
    }

    @PostMapping
    public ResponseEntity<College> createCollege(@RequestBody College college) {
        return new ResponseEntity<>(collegeService.createCollege(college), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<College> updateCollege(@PathVariable Long id, @RequestBody College college) {
        return ResponseEntity.ok(collegeService.updateCollege(id, college));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCollege(@PathVariable Long id) {
        collegeService.deleteCollege(id);
        return ResponseEntity.noContent().build();
    }
}
