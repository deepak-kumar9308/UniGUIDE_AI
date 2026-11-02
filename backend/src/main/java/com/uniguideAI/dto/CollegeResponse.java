package com.uniguideAI.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CollegeResponse {
    private Long id;
    private String name;
    private String location;
    private String collegeType;
    private String description;
    private Double fees;
    private Double cutoff;
    private String eligibility;
    private String placement;
    private Double rating;
    private String website;
    private List<CourseResponse> courses;
}
