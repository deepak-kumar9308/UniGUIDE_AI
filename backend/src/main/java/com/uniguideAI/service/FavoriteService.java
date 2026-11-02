package com.uniguideAI.service;

import com.uniguideAI.entity.College;
import com.uniguideAI.entity.Favorite;
import com.uniguideAI.repository.CollegeRepository;
import com.uniguideAI.repository.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final CollegeRepository collegeRepository;

    @Transactional
    public boolean toggleFavorite(Long studentId, Long collegeId) {

        if (favoriteRepository.existsByStudentIdAndCollegeId(studentId, collegeId)) {
            favoriteRepository.deleteByStudentIdAndCollegeId(studentId, collegeId);
            return false; // Removed
        } else {
            Favorite fav = Favorite.builder()
                    .studentId(studentId)
                    .collegeId(collegeId)
                    .build();
            favoriteRepository.save(fav);
            return true; // Added
        }
    }

    public List<College> getFavoriteColleges(Long studentId) {
        List<Favorite> favs = favoriteRepository.findByStudentId(studentId);
        List<Long> collegeIds = favs.stream().map(Favorite::getCollegeId).collect(Collectors.toList());
        return collegeRepository.findAllById(collegeIds);
    }

    public boolean isFavorite(Long studentId, Long collegeId) {
        return favoriteRepository.existsByStudentIdAndCollegeId(studentId, collegeId);
    }
}
