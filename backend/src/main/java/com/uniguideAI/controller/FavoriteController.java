package com.uniguideAI.controller;

import com.uniguideAI.entity.College;
import com.uniguideAI.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Object>> toggleFavorite(@RequestParam Long studentId, @RequestParam Long collegeId) {
        boolean isFav = favoriteService.toggleFavorite(studentId, collegeId);
        return ResponseEntity.ok(Map.of(
            "studentId", studentId,
            "collegeId", collegeId,
            "isFavorite", isFav,
            "message", isFav ? "College saved to favorites" : "College removed from favorites"
        ));
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<List<College>> getFavorites(@PathVariable Long studentId) {
        return ResponseEntity.ok(favoriteService.getFavoriteColleges(studentId));
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(@RequestParam Long studentId, @RequestParam Long collegeId) {
        return ResponseEntity.ok(Map.of("isFavorite", favoriteService.isFavorite(studentId, collegeId)));
    }
}
