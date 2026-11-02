package com.uniguideAI.repository;

import com.uniguideAI.entity.RecommendationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationHistoryRepository extends JpaRepository<RecommendationHistory, Long> {
    List<RecommendationHistory> findByStudentIdOrderByCreatedAtDesc(Long studentId);
}
