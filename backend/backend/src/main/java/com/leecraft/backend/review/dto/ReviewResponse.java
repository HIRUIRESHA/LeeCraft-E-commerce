package com.leecraft.backend.review.dto;

import com.leecraft.backend.review.model.Review;
import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        Long productId,
        String reviewerName,
        int rating,
        String comment,
        boolean verifiedPurchase,
        LocalDateTime createdAt
) {
    public static ReviewResponse from(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getProduct().getId(),
                review.getReviewerName(),
                review.getRating(),
                review.getComment(),
                review.isVerifiedPurchase(),
                review.getCreatedAt()
        );
    }
}
