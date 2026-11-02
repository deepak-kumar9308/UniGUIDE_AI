package com.uniguideAI.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendation_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long studentId;

    @Column(nullable = false)
    private String recommendedCollege;

    private String recommendedCourse;

    private Double matchPercentage;

    @Column(length = 500)
    private String reason;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
