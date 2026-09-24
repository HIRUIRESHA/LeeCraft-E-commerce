package com.leecraft.backend.review.dto;

import com.leecraft.backend.review.model.Review;
import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        Long productId,
        String productName,
        String productImage,
        String reviewerName,
        int rating,
        String comment,
        boolean verifiedPurchase,
        LocalDateTime createdAt
) {
    public ReviewResponse(Long id, Long productId, String reviewerName, int rating, String comment, boolean verifiedPurchase, LocalDateTime createdAt) {
        this(id, productId, null, null, reviewerName, rating, comment, verifiedPurchase, createdAt);
    }

    public static ReviewResponse from(Review review) {
        String prodName = review.getProduct() != null ? review.getProduct().getName() : null;
        String prodImg = review.getProduct() != null ? review.getProduct().getImageUrl() : null;
        Long prodId = review.getProduct() != null ? review.getProduct().getId() : null;
        return new ReviewResponse(
                review.getId(),
                prodId,
                prodName,
                prodImg,
                review.getReviewerName(),
                review.getRating(),
                review.getComment(),
                review.isVerifiedPurchase(),
                review.getCreatedAt()
        );
    }
}

