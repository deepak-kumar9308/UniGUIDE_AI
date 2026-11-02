package com.uniguideAI.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ScholarshipResponse {
    private Long id;
    private String name;
    private String provider;
    private String description;
    private String eligibility;
    private Double amount;
    private LocalDate deadline;
    private String category;
    private String applicationLink;
}
