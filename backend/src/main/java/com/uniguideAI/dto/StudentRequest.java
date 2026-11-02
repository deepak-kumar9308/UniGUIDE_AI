package com.uniguideAI.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @PositiveOrZero(message = "Marks must be zero or positive")
    private Double marks;

    @PositiveOrZero(message = "Entrance score must be zero or positive")
    private Double entranceScore;

    private String preferredCourse;

    private String preferredLocation;

    @PositiveOrZero(message = "Budget must be zero or positive")
    private Double budget;

    private String careerInterest;

    // Explicit Getters and Setters for robust compilation
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

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
}
