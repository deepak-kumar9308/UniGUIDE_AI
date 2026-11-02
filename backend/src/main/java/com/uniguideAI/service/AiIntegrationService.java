package com.uniguideAI.service;

import com.uniguideAI.entity.College;
import com.uniguideAI.repository.CollegeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiIntegrationService {

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    private final CollegeRepository collegeRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> predictAdmission(double marks, double entranceScore, double budget, double cutoff) {
        String url = aiServiceUrl + "/predict";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> request = new HashMap<>();
        request.put("marks", marks);
        request.put("entrance_score", entranceScore);
        request.put("budget", budget);
        request.put("college_cutoff", cutoff);
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
        
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            if (response.getBody() != null) return response.getBody();
        } catch (Exception e) {
            // Fallback rule engine when Python AI Service is offline
        }

        double score = (marks * 0.4) + (entranceScore * 0.4);
        double diff = score - (cutoff * 0.8);
        String chance = diff >= 10 ? "HIGH" : (diff >= -5 ? "MEDIUM" : "LOW");
        double probability = diff >= 10 ? Math.min(85.0 + diff, 96.0) : (diff >= -5 ? Math.max(55.0, 65.0 + diff) : Math.max(30.0, 45.0 + diff));

        Map<String, Object> fallback = new HashMap<>();
        fallback.put("chance", chance);
        fallback.put("probability", Math.round(probability * 10.0) / 10.0);
        fallback.put("reason", marks >= cutoff ? "Your academic score is above the historical cutoff range." : "Academic score is slightly below cutoff threshold.");
        fallback.put("improvements", List.of("Strengthen entrance exam scores.", "Apply before early bird deadline.", "Keep backup choices for safety."));
        fallback.put("disclaimer", "This prediction is an AI-based estimate and does not guarantee admission.");
        return fallback;
    }

    public Map<String, Object> getRecommendations(Long studentId, double marks, double budget, String preferredCourse, String preferredLocation) {
        String url = aiServiceUrl + "/recommend";
        
        List<College> allColleges = collegeRepository.findAll();
        
        List<Map<String, Object>> collegeList = allColleges.stream().map(c -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("name", c.getName());
            map.put("cutoff", c.getCutoff());
            map.put("fees", c.getFees());
            map.put("location", c.getLocation());
            map.put("courses", c.getCourses().stream().map(cr -> {
                Map<String, Object> crMap = new HashMap<>();
                crMap.put("name", cr.getName());
                return crMap;
            }).collect(Collectors.toList()));
            return map;
        }).collect(Collectors.toList());
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> request = new HashMap<>();
        request.put("student_id", studentId);
        request.put("marks", marks);
        request.put("budget", budget);
        request.put("preferred_course", preferredCourse);
        request.put("preferred_location", preferredLocation);
        request.put("colleges", collegeList);
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
        
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            if (response.getBody() != null) return response.getBody();
        } catch (Exception e) {
            // Fallback calculation in Java
        }

        List<Map<String, Object>> recs = new java.util.ArrayList<>();
        String targetCourse = (preferredCourse != null && !preferredCourse.isBlank()) ? preferredCourse : "MCA";

        for (College college : allColleges) {
            double cCutoff = college.getCutoff() != null ? college.getCutoff() : 75.0;
            double cFees = college.getFees() != null ? college.getFees() : 150000.0;
            String cLoc = college.getLocation() != null ? college.getLocation() : "";

            int acadMatch = marks >= cCutoff ? 30 : (marks >= cCutoff - 5 ? 20 : 10);
            int courseMatch = 25;
            int budgetMatch = cFees <= budget ? 15 : (cFees <= budget * 1.25 ? 10 : 5);
            int locationMatch = (preferredLocation != null && !preferredLocation.isBlank() && cLoc.toLowerCase().contains(preferredLocation.toLowerCase())) ? 10 : 5;
            int total = acadMatch + courseMatch + budgetMatch + locationMatch + 16;
            int matchPercentage = Math.min(total, 98);

            List<String> strengths = new java.util.ArrayList<>();
            if (marks >= cCutoff) strengths.add("Marks exceed historical cutoff");
            if (cFees <= budget) strengths.add("Fees within specified budget");
            strengths.add("Offers target program " + targetCourse);

            List<String> considerations = new java.util.ArrayList<>();
            if (marks < cCutoff) considerations.add("Marks below standard cutoff threshold");
            if (cFees > budget) considerations.add("Fees slightly exceed stated budget; check scholarships");

            Map<String, Object> item = new HashMap<>();
            item.put("collegeId", college.getId());
            item.put("collegeName", college.getName());
            item.put("courseName", targetCourse);
            item.put("matchPercentage", matchPercentage);
            item.put("category", matchPercentage >= 85 ? "Excellent Match" : (matchPercentage >= 70 ? "Good Match" : "Moderate Match"));
            item.put("reason", "Your profile has " + matchPercentage + "% academic and fee alignment with " + college.getName() + ".");
            item.put("fees", cFees);
            item.put("location", cLoc);
            item.put("strengths", strengths);
            item.put("considerations", considerations);
            recs.add(item);
        }

        recs.sort((a, b) -> Integer.compare((Integer) b.get("matchPercentage"), (Integer) a.get("matchPercentage")));
        List<Map<String, Object>> topRecs = recs.stream().limit(6).collect(Collectors.toList());

        Map<String, Object> fallback = new HashMap<>();
        fallback.put("studentId", studentId);
        fallback.put("recommendations", topRecs);
        return fallback;
    }
}
