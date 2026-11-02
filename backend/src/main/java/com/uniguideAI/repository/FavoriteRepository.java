package com.uniguideAI.repository;

import com.uniguideAI.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByStudentId(Long studentId);
    Optional<Favorite> findByStudentIdAndCollegeId(Long studentId, Long collegeId);
    void deleteByStudentIdAndCollegeId(Long studentId, Long collegeId);
    boolean existsByStudentIdAndCollegeId(Long studentId, Long collegeId);
}
