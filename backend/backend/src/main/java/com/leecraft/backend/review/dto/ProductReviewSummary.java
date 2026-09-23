package com.leecraft.backend.review.dto;

import java.util.List;
import java.util.Map;

public record ProductReviewSummary(
        Long productId,
        double averageRating,
        long totalReviews,
        Map<Integer, Long> ratingDistribution,
        List<ReviewResponse> reviews
) {}
