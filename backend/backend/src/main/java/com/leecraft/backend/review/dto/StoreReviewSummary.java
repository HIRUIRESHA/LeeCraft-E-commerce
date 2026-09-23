package com.leecraft.backend.review.dto;

import java.util.List;

public record StoreReviewSummary(
        double averageRating,
        long totalReviews,
        long fiveStarCount,
        List<ReviewResponse> reviews
) {}
