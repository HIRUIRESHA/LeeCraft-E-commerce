package com.leecraft.backend.review.controller;

import com.leecraft.backend.review.dto.ProductReviewSummary;
import com.leecraft.backend.review.dto.ReviewRequest;
import com.leecraft.backend.review.dto.ReviewResponse;
import com.leecraft.backend.review.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<ProductReviewSummary> getReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> addReview(
            @PathVariable Long productId,
            @Valid @RequestBody ReviewRequest request) {
        ReviewResponse response = reviewService.addReview(productId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
