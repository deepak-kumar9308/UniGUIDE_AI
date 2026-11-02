package com.uniguideAI.service;

import com.uniguideAI.entity.Application;
import com.uniguideAI.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public List<Application> getApplicationsByStudent(Long studentId) {
        return applicationRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }

    public Application createApplication(Application application) {
        if (application.getStatus() == null || application.getStatus().isBlank()) {
            application.setStatus("Planning");
        }
        return applicationRepository.save(application);
    }

    public Application updateApplication(Long id, Application updated) {
        Application existing = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));

        existing.setCollegeName(updated.getCollegeName());
        existing.setCourseName(updated.getCourseName());
        existing.setStatus(updated.getStatus());
        existing.setApplicationDate(updated.getApplicationDate());
        existing.setDeadline(updated.getDeadline());
        existing.setNotes(updated.getNotes());

        return applicationRepository.save(existing);
    }

    public void deleteApplication(Long id) {
        applicationRepository.deleteById(id);
    }
}
