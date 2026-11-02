package com.uniguideAI.repository;

import com.uniguideAI.entity.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CollegeRepository extends JpaRepository<College, Long> {
    
    // Custom search by keyword (name, location, or course name)
    @Query("SELECT DISTINCT c FROM College c LEFT JOIN c.courses cr WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.location) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(cr.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<College> searchByKeyword(@Param("keyword") String keyword);

    List<College> findByLocationContainingIgnoreCase(String location);
}
