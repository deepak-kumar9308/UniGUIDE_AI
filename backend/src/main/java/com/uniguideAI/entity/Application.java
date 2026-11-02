package com.uniguideAI.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long studentId;

    @Column(nullable = false)
    private String collegeName;

    @Column(nullable = false)
    private String courseName;

    @Column(nullable = false)
    private String status; // Not Applied, Planning, Applied, Under Review, Accepted, Rejected

    private LocalDate applicationDate;

    private LocalDate deadline;

    @Column(length = 1000)
    private String notes;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
