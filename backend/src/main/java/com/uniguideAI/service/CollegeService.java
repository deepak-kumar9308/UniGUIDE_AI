package com.uniguideAI.service;

import com.uniguideAI.dto.CollegeResponse;
import com.uniguideAI.dto.CourseResponse;
import com.uniguideAI.entity.College;
import com.uniguideAI.repository.CollegeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CollegeService {

    private final CollegeRepository collegeRepository;

    public List<CollegeResponse> getAllColleges() {
        return collegeRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CollegeResponse getCollegeById(Long id) {
        College college = collegeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("College not found"));
        return mapToResponse(college);
    }

    public List<CollegeResponse> searchColleges(String keyword) {
        return collegeRepository.searchByKeyword(keyword)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<CollegeResponse> filterByLocation(String location) {
        return collegeRepository.findByLocationContainingIgnoreCase(location)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public College createCollege(College college) {
        return collegeRepository.save(college);
    }

    public College updateCollege(Long id, College updated) {
        College existing = collegeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("College not found with id: " + id));

        existing.setName(updated.getName());
        existing.setLocation(updated.getLocation());
        existing.setCollegeType(updated.getCollegeType());
        existing.setDescription(updated.getDescription());
        existing.setFees(updated.getFees());
        existing.setCutoff(updated.getCutoff());
        existing.setEligibility(updated.getEligibility());
        existing.setPlacement(updated.getPlacement());
        existing.setRating(updated.getRating());
        existing.setWebsite(updated.getWebsite());

        return collegeRepository.save(existing);
    }

    public void deleteCollege(Long id) {
        if (!collegeRepository.existsById(id)) {
            throw new RuntimeException("College not found with id: " + id);
        }
        collegeRepository.deleteById(id);
    }


    // Mapping method
    private CollegeResponse mapToResponse(College college) {
        List<CourseResponse> courseResponses = null;
        if (college.getCourses() != null) {
            courseResponses = college.getCourses().stream()
                    .map(course -> CourseResponse.builder()
                            .id(course.getId())
                            .name(course.getName())
                            .description(course.getDescription())
                            .duration(course.getDuration())
                            .eligibility(course.getEligibility())
                            .averageFees(course.getAverageFees())
                            .careerOptions(course.getCareerOptions())
                            .build())
                    .collect(Collectors.toList());
        }

        return CollegeResponse.builder()
                .id(college.getId())
                .name(college.getName())
                .location(college.getLocation())
                .collegeType(college.getCollegeType())
                .description(college.getDescription())
                .fees(college.getFees())
                .cutoff(college.getCutoff())
                .eligibility(college.getEligibility())
                .placement(college.getPlacement())
                .rating(college.getRating())
                .website(college.getWebsite())
                .courses(courseResponses)
                .build();
    }
}
