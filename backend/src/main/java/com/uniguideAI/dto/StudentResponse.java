package com.uniguideAI.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentResponse {

    private Long id;
    private String name;
    private String email;
    private Double marks;
    private Double entranceScore;
    private String preferredCourse;
    private String preferredLocation;
    private Double budget;
    private String careerInterest;
    private String role;

    // Explicit Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Double getMarks() { return marks; }
    public void setMarks(Double marks) { this.marks = marks; }

    public Double getEntranceScore() { return entranceScore; }
    public void setEntranceScore(Double entranceScore) { this.entranceScore = entranceScore; }

    public String getPreferredCourse() { return preferredCourse; }
    public void setPreferredCourse(String preferredCourse) { this.preferredCourse = preferredCourse; }

    public String getPreferredLocation() { return preferredLocation; }
    public void setPreferredLocation(String preferredLocation) { this.preferredLocation = preferredLocation; }

    public Double getBudget() { return budget; }
    public void setBudget(Double budget) { this.budget = budget; }

    public String getCareerInterest() { return careerInterest; }
    public void setCareerInterest(String careerInterest) { this.careerInterest = careerInterest; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
