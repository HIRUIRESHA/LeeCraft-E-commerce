package com.leecraft.backend.review.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReviewRequest(
        Long productId,

        @NotBlank(message = "Reviewer name is required")
        @Size(max = 100, message = "Name must not exceed 100 characters")
        String reviewerName,

        @Email(message = "Invalid email format")
        String reviewerEmail,

        @NotNull(message = "Rating is required")
        @Min(value = 1, message = "Rating must be at least 1")
        @Max(value = 5, message = "Rating must be at most 5")
        Integer rating,

        @NotBlank(message = "Comment is required")
        @Size(max = 2000, message = "Comment must not exceed 2000 characters")
        String comment,

        String orderId
) {
    public ReviewRequest(String reviewerName, String reviewerEmail, Integer rating, String comment) {
        this(null, reviewerName, reviewerEmail, rating, comment, null);
    }

    public ReviewRequest(Long productId, String reviewerName, String reviewerEmail, Integer rating, String comment) {
        this(productId, reviewerName, reviewerEmail, rating, comment, null);
    }
}
