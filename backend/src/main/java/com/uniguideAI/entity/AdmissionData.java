package com.uniguideAI.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "admission_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdmissionData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long collegeId;

    @Column(nullable = false)
    private Long courseId;

    private Integer year;

    private Double cutoff;

    private Double minimumMarks;

    private Boolean entranceRequired;

    private Integer seatAvailability;
}
