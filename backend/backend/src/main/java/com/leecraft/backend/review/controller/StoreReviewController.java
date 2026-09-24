package com.leecraft.backend.review.controller;

import com.leecraft.backend.review.dto.StoreReviewSummary;
import com.leecraft.backend.review.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class StoreReviewController {

    private final ReviewService reviewService;

    public StoreReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/featured")
    public ResponseEntity<StoreReviewSummary> getFeaturedReviews(
            @RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(reviewService.getStoreReviewSummary(limit));
    }

    @PostMapping
    public ResponseEntity<com.leecraft.backend.review.dto.ReviewResponse> createReview(
            @jakarta.validation.Valid @RequestBody com.leecraft.backend.review.dto.ReviewRequest request) {
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED)
                .body(reviewService.addGeneralOrProductReview(request));
    }
}
