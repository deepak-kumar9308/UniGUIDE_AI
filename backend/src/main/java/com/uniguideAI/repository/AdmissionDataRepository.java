package com.uniguideAI.repository;

import com.uniguideAI.entity.AdmissionData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdmissionDataRepository extends JpaRepository<AdmissionData, Long> {
    List<AdmissionData> findByCollegeId(Long collegeId);
}
