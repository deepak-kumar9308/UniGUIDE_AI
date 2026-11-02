package com.uniguideAI.service;

import com.uniguideAI.dto.StudentRequest;
import com.uniguideAI.dto.StudentResponse;
import com.uniguideAI.entity.Student;
import com.uniguideAI.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentResponse createStudent(StudentRequest request) {
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        Student student = Student.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) 
                .marks(request.getMarks())
                .entranceScore(request.getEntranceScore())
                .preferredCourse(request.getPreferredCourse())
                .preferredLocation(request.getPreferredLocation())
                .budget(request.getBudget())
                .careerInterest(request.getCareerInterest())
                .build();

        Student savedStudent = studentRepository.save(student);
        return mapToResponse(savedStudent);
    }

    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        return mapToResponse(student);
    }

    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

        // Note: Email updates and password updates might require special handling.
        student.setName(request.getName());
        student.setMarks(request.getMarks());
        student.setEntranceScore(request.getEntranceScore());
        student.setPreferredCourse(request.getPreferredCourse());
        student.setPreferredLocation(request.getPreferredLocation());
        student.setBudget(request.getBudget());
        student.setCareerInterest(request.getCareerInterest());

        Student updatedStudent = studentRepository.save(student);
        return mapToResponse(updatedStudent);
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    public java.util.Map<String, Object> getProfileOverview(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

        List<String> missingFields = new java.util.ArrayList<>();
        int filled = 0;
        int total = 6;

        if (student.getMarks() != null && student.getMarks() > 0) filled++; else missingFields.add("Academic Marks");
        if (student.getEntranceScore() != null && student.getEntranceScore() > 0) filled++; else missingFields.add("Entrance Score");
        if (student.getPreferredCourse() != null && !student.getPreferredCourse().isBlank()) filled++; else missingFields.add("Preferred Course");
        if (student.getPreferredLocation() != null && !student.getPreferredLocation().isBlank()) filled++; else missingFields.add("Preferred Location");
        if (student.getBudget() != null && student.getBudget() > 0) filled++; else missingFields.add("Budget");
        if (student.getCareerInterest() != null && !student.getCareerInterest().isBlank() && !"Not specified".equalsIgnoreCase(student.getCareerInterest())) filled++; else missingFields.add("Career Interest");

        int completionPercentage = (int) Math.round(((double) filled / total) * 100);
        if (completionPercentage < 20) completionPercentage = 20; // Default minimum base completion

        java.util.Map<String, Object> overview = new java.util.HashMap<>();
        overview.put("student", mapToResponse(student));
        overview.put("completionPercentage", completionPercentage);
        overview.put("missingFields", missingFields);
        overview.put("isComplete", missingFields.isEmpty());

        return overview;
    }

    private StudentResponse mapToResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .name(student.getName())
                .email(student.getEmail())
                .marks(student.getMarks())
                .entranceScore(student.getEntranceScore())
                .preferredCourse(student.getPreferredCourse())
                .preferredLocation(student.getPreferredLocation())
                .budget(student.getBudget())
                .careerInterest(student.getCareerInterest())
                .role(student.getRole())
                .build();
    }
}

