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
        String reviewType,
        LocalDateTime createdAt
) {
    public ReviewResponse(Long id, Long productId, String reviewerName, int rating, String comment, boolean verifiedPurchase, LocalDateTime createdAt) {
        this(id, productId, null, null, reviewerName, rating, comment, verifiedPurchase, productId != null ? "PRODUCT" : "STORE", createdAt);
    }

    public ReviewResponse(Long id, Long productId, String productName, String productImage, String reviewerName, int rating, String comment, boolean verifiedPurchase, LocalDateTime createdAt) {
        this(id, productId, productName, productImage, reviewerName, rating, comment, verifiedPurchase, productId != null ? "PRODUCT" : "STORE", createdAt);
    }

    public static ReviewResponse from(Review review) {
        String prodName = review.getProduct() != null ? review.getProduct().getName() : "LeeCraft Store Experience";
        String prodImg = review.getProduct() != null ? review.getProduct().getImageUrl() : null;
        Long prodId = review.getProduct() != null ? review.getProduct().getId() : null;
        String type = review.getReviewType() != null ? review.getReviewType() : (review.getProduct() != null ? "PRODUCT" : "STORE");
        return new ReviewResponse(
                review.getId(),
                prodId,
                prodName,
                prodImg,
                review.getReviewerName(),
                review.getRating(),
                review.getComment(),
                review.isVerifiedPurchase(),
                type,
                review.getCreatedAt()
        );
    }
}

