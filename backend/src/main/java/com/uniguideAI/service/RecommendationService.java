package com.uniguideAI.service;

import com.uniguideAI.entity.College;
import com.uniguideAI.entity.RecommendationHistory;
import com.uniguideAI.entity.Student;
import com.uniguideAI.repository.CollegeRepository;
import com.uniguideAI.repository.RecommendationHistoryRepository;
import com.uniguideAI.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationHistoryRepository recommendationHistoryRepository;
    private final StudentRepository studentRepository;
    private final CollegeRepository collegeRepository;
    private final AiIntegrationService aiIntegrationService;

    public List<RecommendationHistory> getRecommendationsForStudent(Long studentId) {
        return recommendationHistoryRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }

    public Map<String, Object> generateRecommendationsForStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        double marks = student.getMarks() != null ? student.getMarks() : 75.0;
        double budget = student.getBudget() != null ? student.getBudget() : 200000.0;
        String preferredCourse = student.getPreferredCourse() != null ? student.getPreferredCourse() : "MCA";
        String preferredLocation = student.getPreferredLocation() != null ? student.getPreferredLocation() : "";

        Map<String, Object> aiResult = aiIntegrationService.getRecommendations(studentId, marks, budget, preferredCourse, preferredLocation);

        if (aiResult.containsKey("recommendations") && aiResult.get("recommendations") instanceof List) {
            List<Map<String, Object>> recs = (List<Map<String, Object>>) aiResult.get("recommendations");
            for (Map<String, Object> rec : recs) {
                String collegeName = (String) rec.get("collegeName");
                Double matchPercentage = rec.get("matchPercentage") != null ? Double.valueOf(rec.get("matchPercentage").toString()) : 75.0;
                String reason = rec.get("reason") != null ? rec.get("reason").toString() : "Matches profile preferences";

                RecommendationHistory history = RecommendationHistory.builder()
                        .studentId(studentId)
                        .recommendedCollege(collegeName)
                        .recommendedCourse(preferredCourse)
                        .matchPercentage(matchPercentage)
                        .reason(reason)
                        .build();
                recommendationHistoryRepository.save(history);
            }
        }

        return aiResult;
    }
}
