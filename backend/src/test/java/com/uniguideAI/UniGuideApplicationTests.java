package com.uniguideAI;

import com.uniguideAI.dto.CollegeResponse;
import com.uniguideAI.dto.StudentRequest;
import com.uniguideAI.dto.StudentResponse;
import com.uniguideAI.service.CollegeService;
import com.uniguideAI.service.ScholarshipService;
import com.uniguideAI.service.StudentService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class UniGuideApplicationTests {

    @Autowired
    private StudentService studentService;

    @Autowired
    private CollegeService collegeService;

    @Autowired
    private ScholarshipService scholarshipService;

    @Test
    @DisplayName("TC-001: Student Creation Test")
    void testCreateStudent() {
        StudentRequest request = StudentRequest.builder()
                .name("UnitTest Student")
                .email("unittest@uniguide.com")
                .password("Password@123")
                .marks(85.0)
                .entranceScore(80.0)
                .preferredCourse("MCA")
                .preferredLocation("Punjab")
                .budget(200000.0)
                .careerInterest("Software Developer")
                .build();

        StudentResponse response = studentService.createStudent(request);
        assertNotNull(response.getId());
        assertEquals("UnitTest Student", response.getName());
        assertEquals("unittest@uniguide.com", response.getEmail());
    }

    @Test
    @DisplayName("TC-002: Profile Overview & Completion Percentage Calculation")
    void testProfileOverview() {
        StudentRequest request = StudentRequest.builder()
                .name("Partial Student")
                .email("partial@uniguide.com")
                .password("Password@123")
                .marks(78.0)
                .preferredCourse("MCA")
                .build();

        StudentResponse created = studentService.createStudent(request);
        Map<String, Object> overview = studentService.getProfileOverview(created.getId());

        assertNotNull(overview.get("completionPercentage"));
        assertTrue((int) overview.get("completionPercentage") > 0);
        assertFalse((boolean) overview.get("isComplete"));
    }

    @Test
    @DisplayName("TC-003: College Retrieval & Search Test")
    void testCollegeRetrieval() {
        List<CollegeResponse> colleges = collegeService.getAllColleges();
        assertNotNull(colleges);

        List<CollegeResponse> search = collegeService.searchColleges("Chandigarh");
        assertNotNull(search);
    }

    @Test
    @DisplayName("TC-004: Scholarship Retrieval & Matching Test")
    void testScholarshipMatching() {
        List<Map<String, Object>> scholarships = scholarshipService.getMatchingScholarshipsForStudent(1L);
        assertNotNull(scholarships);
    }
}
