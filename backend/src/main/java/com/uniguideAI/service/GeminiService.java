package com.uniguideAI.service;

import com.uniguideAI.entity.Student;
import com.uniguideAI.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private final StudentRepository studentRepository;

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";
    private final RestTemplate restTemplate = new RestTemplate();

    public String getChatResponse(String message, Long studentId) {
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("You are UniGuide AI, a professional and helpful college admission counselor. ");
        promptBuilder.append("Guidelines: Give concise, encouraging advice. Do not guarantee admission or invent unofficial college/scholarship deadlines. ");
        promptBuilder.append("Remind the student to verify official dates on the institution's website when necessary.\n\n");

        if (studentId != null) {
            studentRepository.findById(studentId).ifPresent(student -> {
                promptBuilder.append("Student Context:\n");
                if (student.getName() != null) promptBuilder.append("- Name: ").append(student.getName()).append("\n");
                if (student.getPreferredCourse() != null) promptBuilder.append("- Preferred Course: ").append(student.getPreferredCourse()).append("\n");
                if (student.getMarks() != null) promptBuilder.append("- Academic Marks: ").append(student.getMarks()).append("%\n");
                if (student.getEntranceScore() != null) promptBuilder.append("- Entrance Score: ").append(student.getEntranceScore()).append("\n");
                if (student.getPreferredLocation() != null) promptBuilder.append("- Preferred Location: ").append(student.getPreferredLocation()).append("\n");
                if (student.getBudget() != null) promptBuilder.append("- Annual Budget: ₹").append(student.getBudget()).append("\n");
                if (student.getCareerInterest() != null) promptBuilder.append("- Career Interest: ").append(student.getCareerInterest()).append("\n");
                promptBuilder.append("\n");
            });
        }

        promptBuilder.append("Student Question: ").append(message);

        if (geminiApiKey == null || geminiApiKey.contains("placeholder") || geminiApiKey.trim().isEmpty()) {
            return generateMockAiResponse(message, studentId);
        }

        String url = GEMINI_API_URL + geminiApiKey;

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", promptBuilder.toString());

        Map<String, Object> partsMap = new HashMap<>();
        partsMap.put("parts", List.of(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(partsMap));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    return (String) parts.get(0).get("text");
                }
            }
            return generateMockAiResponse(message, studentId);
        } catch (Exception e) {
            System.err.println("Gemini API Error: " + e.getMessage());
            return generateMockAiResponse(message, studentId);
        }
    }

    private String generateMockAiResponse(String message, Long studentId) {
        String msgLower = message.toLowerCase();
        
        if (msgLower.contains("mca")) {
            return "Master of Computer Applications (MCA) is a popular 2-year postgraduate degree focusing on software development, web application engineering, database administration, and system design. Top colleges look for solid mathematics/CS backgrounds.";
        } else if (msgLower.contains("college") || msgLower.contains("match") || msgLower.contains("recommend")) {
            return "Based on your academic profile, recommended colleges include Delhi University, Chandigarh University, and Panjab University. Check our AI Recommendation tab for full weighted compatibility breakdowns.";
        } else if (msgLower.contains("document") || msgLower.contains("require")) {
            return "Standard documents for MCA admission typically include: 1. Bachelor's Marksheets, 2. Entrance Scorecard (NIMCET/State CET), 3. Category Certificate (if applicable), 4. Transfer/Migration Certificate, and 5. Govt Photo ID. Always verify specific document checklists on the official college portal.";
        } else if (msgLower.contains("scholarship")) {
            return "You may be eligible for Post-Matric Merit Scholarships or State Higher Education Grants depending on your academic score and category. Check our Scholarship Finder tool for detailed eligibility requirements.";
        } else {
            return "Thank you for asking! For admission guidance regarding course choice, cutoffs, and document checklists, UniGuide AI is here to help. Please verify final deadlines and seat availability on the official university portal.";
        }
    }
}
