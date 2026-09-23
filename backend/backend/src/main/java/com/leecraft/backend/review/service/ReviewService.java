package com.leecraft.backend.review.service;

import com.leecraft.backend.order.repositories.OrderRepository;
import com.leecraft.backend.product.model.Product;
import com.leecraft.backend.product.repository.ProductRepository;
import com.leecraft.backend.review.dto.ProductReviewSummary;
import com.leecraft.backend.review.dto.ReviewRequest;
import com.leecraft.backend.review.dto.ReviewResponse;
import com.leecraft.backend.review.dto.StoreReviewSummary;
import com.leecraft.backend.review.model.Review;
import com.leecraft.backend.review.repository.ReviewRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         ProductRepository productRepository,
                         OrderRepository orderRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public ProductReviewSummary getProductReviews(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found with id: " + productId);
        }

        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        Double rawAvg = reviewRepository.getAverageRatingForProduct(productId);
        double avgRating = rawAvg != null
                ? BigDecimal.valueOf(rawAvg).setScale(1, RoundingMode.HALF_UP).doubleValue()
                : 0.0;

        Map<Integer, Long> distribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            distribution.put(i, 0L);
        }

        List<Object[]> distRows = reviewRepository.getRatingDistributionForProduct(productId);
        for (Object[] row : distRows) {
            Integer rating = (Integer) row[0];
            Long count = (Long) row[1];
            if (rating != null) {
                distribution.put(rating, count);
            }
        }

        List<ReviewResponse> reviewResponses = reviews.stream()
                .map(ReviewResponse::from)
                .toList();

        return new ProductReviewSummary(
                productId,
                avgRating,
                reviews.size(),
                distribution,
                reviewResponses
        );
    }

    @Transactional(readOnly = true)
    public StoreReviewSummary getStoreReviewSummary(int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 30));
        Pageable pageable = PageRequest.of(0, safeLimit);
        List<Review> topReviews = reviewRepository.findTopReviews(pageable);

        Double rawAvg = reviewRepository.getOverallAverageRating();
        double avgRating = (rawAvg != null && rawAvg > 0)
                ? BigDecimal.valueOf(rawAvg).setScale(1, RoundingMode.HALF_UP).doubleValue()
                : 5.0;

        long totalCount = reviewRepository.count();
        long fiveStarCount = reviewRepository.countFiveStarReviews();

        List<ReviewResponse> reviewResponses = topReviews.stream()
                .map(ReviewResponse::from)
                .toList();

        return new StoreReviewSummary(
                avgRating,
                totalCount,
                fiveStarCount,
                reviewResponses
        );
    }

    @Transactional
    public ReviewResponse addReview(Long productId, ReviewRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        Review review = new Review();
        review.setProduct(product);
        review.setReviewerName(request.reviewerName().trim());
        review.setReviewerEmail(request.reviewerEmail() != null ? request.reviewerEmail().trim() : null);
        review.setRating(request.rating());
        review.setComment(request.comment().trim());

        // Check if verified purchase
        if (request.reviewerEmail() != null && !request.reviewerEmail().isBlank()) {
            boolean hasPurchased = orderRepository.existsByEmailAndProductId(
                    request.reviewerEmail().trim(), productId
            );
            review.setVerifiedPurchase(hasPurchased);
        } else {
            review.setVerifiedPurchase(false);
        }

        Review saved = reviewRepository.save(review);
        return ReviewResponse.from(saved);
    }
}

