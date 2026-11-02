package com.uniguideAI.service;

import com.uniguideAI.dto.ScholarshipResponse;
import com.uniguideAI.entity.Scholarship;
import com.uniguideAI.entity.Student;
import com.uniguideAI.repository.ScholarshipRepository;
import com.uniguideAI.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScholarshipService {

    private final ScholarshipRepository scholarshipRepository;
    private final StudentRepository studentRepository;

    public List<ScholarshipResponse> getAllScholarships() {
        return scholarshipRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ScholarshipResponse getScholarshipById(Long id) {
        Scholarship scholarship = scholarshipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scholarship not found with id: " + id));
        return mapToResponse(scholarship);
    }

    public List<ScholarshipResponse> searchScholarships(String keyword) {
        return scholarshipRepository.findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getMatchingScholarshipsForStudent(Long studentId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        List<Scholarship> scholarships = scholarshipRepository.findAll();
        LocalDate now = LocalDate.now();

        List<Map<String, Object>> results = new ArrayList<>();

        for (Scholarship s : scholarships) {
            Map<String, Object> item = new HashMap<>();
            boolean isExpired = s.getDeadline() != null && s.getDeadline().isBefore(now);
            
            int matchPercentage = 70;
            List<String> reasons = new ArrayList<>();

            if (student != null) {
                if (student.getMarks() != null && student.getMarks() >= 75.0) {
                    matchPercentage += 15;
                    reasons.add("Your academic score satisfies the high-merit criteria.");
                } else if (student.getMarks() != null && student.getMarks() >= 60.0) {
                    matchPercentage += 10;
                    reasons.add("Your marks satisfy minimum eligibility requirement.");
                }

                if (student.getPreferredCourse() != null && s.getEligibility() != null &&
                    s.getEligibility().toLowerCase().contains(student.getPreferredCourse().toLowerCase())) {
                    matchPercentage += 10;
                    reasons.add("Direct match for your target course (" + student.getPreferredCourse() + ").");
                }
            }

            if (reasons.isEmpty()) {
                reasons.add("General eligibility criteria matched.");
            }

            item.put("scholarship", mapToResponse(s));
            item.put("matchPercentage", Math.min(matchPercentage, 98));
            item.put("reason", String.join(" ", reasons));
            item.put("isExpired", isExpired);

            results.add(item);
        }

        // Sort: Active first, then highest match percentage
        results.sort((a, b) -> {
            boolean expA = (boolean) a.get("isExpired");
            boolean expB = (boolean) b.get("isExpired");
            if (expA != expB) return expA ? 1 : -1;
            return Integer.compare((Integer) b.get("matchPercentage"), (Integer) a.get("matchPercentage"));
        });

        return results;
    }

    public Scholarship createScholarship(Scholarship scholarship) {
        return scholarshipRepository.save(scholarship);
    }

    public Scholarship updateScholarship(Long id, Scholarship updated) {
        Scholarship existing = scholarshipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scholarship not found with id: " + id));

        existing.setName(updated.getName());
        existing.setProvider(updated.getProvider());
        existing.setDescription(updated.getDescription());
        existing.setEligibility(updated.getEligibility());
        existing.setAmount(updated.getAmount());
        existing.setDeadline(updated.getDeadline());
        existing.setCategory(updated.getCategory());
        existing.setApplicationLink(updated.getApplicationLink());

        return scholarshipRepository.save(existing);
    }

    public void deleteScholarship(Long id) {
        if (!scholarshipRepository.existsById(id)) {
            throw new RuntimeException("Scholarship not found with id: " + id);
        }
        scholarshipRepository.deleteById(id);
    }

    private ScholarshipResponse mapToResponse(Scholarship scholarship) {
        return ScholarshipResponse.builder()
                .id(scholarship.getId())
                .name(scholarship.getName())
                .provider(scholarship.getProvider())
                .description(scholarship.getDescription())
                .eligibility(scholarship.getEligibility())
                .amount(scholarship.getAmount())
                .deadline(scholarship.getDeadline())
                .category(scholarship.getCategory())
                .applicationLink(scholarship.getApplicationLink())
                .build();
    }
}
