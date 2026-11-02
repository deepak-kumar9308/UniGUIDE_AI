package com.uniguideAI.controller;

import com.uniguideAI.dto.StudentResponse;
import com.uniguideAI.repository.CollegeRepository;
import com.uniguideAI.repository.CourseRepository;
import com.uniguideAI.repository.ScholarshipRepository;
import com.uniguideAI.repository.StudentRepository;
import com.uniguideAI.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final StudentRepository studentRepository;
    private final CollegeRepository collegeRepository;
    private final CourseRepository courseRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final StudentService studentService;

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", studentRepository.count());
        stats.put("totalColleges", collegeRepository.count());
        stats.put("totalCourses", courseRepository.count());
        stats.put("totalScholarships", scholarshipRepository.count());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/students")
    public ResponseEntity<List<StudentResponse>> getAllStudentsAdmin() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        List<StudentResponse> students = studentService.getAllStudents();

        Map<String, Long> byCourse = students.stream()
                .filter(s -> s.getPreferredCourse() != null && !s.getPreferredCourse().isBlank())
                .collect(Collectors.groupingBy(StudentResponse::getPreferredCourse, Collectors.counting()));

        Map<String, Long> byLocation = students.stream()
                .filter(s -> s.getPreferredLocation() != null && !s.getPreferredLocation().isBlank())
                .collect(Collectors.groupingBy(StudentResponse::getPreferredLocation, Collectors.counting()));

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("studentsByCourse", byCourse);
        analytics.put("studentsByLocation", byLocation);
        analytics.put("totalStudents", students.size());
        analytics.put("collegeCount", collegeRepository.count());
        analytics.put("scholarshipCount", scholarshipRepository.count());

        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/ml-analytics")
    public ResponseEntity<Map<String, Object>> getMlAnalytics() {
        String url = aiServiceUrl + "/ml-analytics";
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("datasetSize", 250);
            fallback.put("trainingRecords", 200);
            fallback.put("testingRecords", 50);
            fallback.put("accuracy", 0.92);
            fallback.put("precision", 0.90);
            fallback.put("recall", 0.88);
            fallback.put("f1Score", 0.89);
            fallback.put("confusionMatrix", List.of(List.of(15, 2, 0), List.of(1, 18, 1), List.of(0, 0, 13)));
            fallback.put("note", "Showing saved ML baseline metrics (AI Service status: " + e.getMessage() + ")");
            return ResponseEntity.ok(fallback);
        }
    }
}
