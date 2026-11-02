package com.uniguideAI.controller;

import com.uniguideAI.dto.StudentRequest;
import com.uniguideAI.dto.StudentResponse;
import com.uniguideAI.entity.Student;
import com.uniguideAI.repository.StudentRepository;
import com.uniguideAI.security.JwtService;
import com.uniguideAI.service.StudentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final StudentService studentService;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final StudentRepository studentRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody StudentRequest request) {
        // studentService creates the student and handles hashing if properly configured
        StudentResponse student = studentService.createStudent(request);
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(student.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);
        
        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwtToken)
                .student(student)
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);
        
        Student student = studentRepository.findByEmail(request.getEmail()).orElseThrow();
        
        StudentResponse studentResponse = StudentResponse.builder()
                .id(student.getId())
                .name(student.getName())
                .email(student.getEmail())
                .marks(student.getMarks())
                .entranceScore(student.getEntranceScore())
                .preferredCourse(student.getPreferredCourse())
                .preferredLocation(student.getPreferredLocation())
                .budget(student.getBudget())
                .careerInterest(student.getCareerInterest())
                .build();
                
        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwtToken)
                .student(studentResponse)
                .build());
    }
}

// Inline DTOs to keep it simple for the controller

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
class AuthRequest {
    @NotBlank
    private String email;
    @NotBlank
    private String password;
}

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
class AuthResponse {
    private String token;
    private StudentResponse student;
}
