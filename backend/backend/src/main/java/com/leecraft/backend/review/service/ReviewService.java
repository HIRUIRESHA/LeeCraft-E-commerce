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
        ReviewRequest resolvedReq = new ReviewRequest(
                productId,
                request.reviewerName(),
                request.reviewerEmail(),
                request.rating(),
                request.comment(),
                request.orderId()
        );
        return addGeneralOrProductReview(resolvedReq);
    }

    @Transactional
    public ReviewResponse addGeneralOrProductReview(ReviewRequest request) {
        Review review = new Review();
        review.setReviewerName(request.reviewerName().trim());
        review.setReviewerEmail(request.reviewerEmail() != null ? request.reviewerEmail().trim() : null);
        review.setRating(request.rating());
        review.setComment(request.comment().trim());
        review.setOrderId(request.orderId());

        String orderRef = (request.orderId() != null && !request.orderId().isBlank())
                ? request.orderId().trim()
                : null;
        java.util.Optional<com.leecraft.backend.order.models.Order> matchedOrder = java.util.Optional.empty();
        if (orderRef != null) {
            matchedOrder = orderRepository.findByOrderNumber(orderRef);
            if (matchedOrder.isEmpty()) {
                try {
                    Long numericId = Long.parseLong(orderRef);
                    matchedOrder = orderRepository.findById(numericId);
                } catch (NumberFormatException ignored) {}
            }
        }

        Long prodId = request.productId();
        if (prodId != null && prodId > 0) {
            Product product = productRepository.findById(prodId)
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + prodId));
            review.setProduct(product);
            review.setReviewType("PRODUCT");

            // Check if verified purchase for this product
            boolean hasPurchased = false;
            if (request.reviewerEmail() != null && !request.reviewerEmail().isBlank()) {
                hasPurchased = orderRepository.existsByEmailAndProductId(
                        request.reviewerEmail().trim(), prodId
                );
            }
            if (!hasPurchased && matchedOrder.isPresent()) {
                var o = matchedOrder.get();
                if (o.getStatus() != com.leecraft.backend.order.models.OrderStatus.CANCELLED) {
                    hasPurchased = o.getItems().stream()
                            .anyMatch(i -> String.valueOf(prodId).equals(i.getProductId()));
                }
            }
            review.setVerifiedPurchase(hasPurchased);
        } else {
            // Common Store Review
            review.setProduct(null);
            review.setReviewType("STORE");

            // Check if verified customer
            boolean isCustomer = false;
            if (request.reviewerEmail() != null && !request.reviewerEmail().isBlank()) {
                isCustomer = orderRepository.existsByEmailAndNotCancelled(request.reviewerEmail().trim());
            }
            if (!isCustomer && matchedOrder.isPresent()) {
                isCustomer = matchedOrder.get().getStatus() != com.leecraft.backend.order.models.OrderStatus.CANCELLED;
            }
            review.setVerifiedPurchase(isCustomer);
        }

        Review saved = reviewRepository.save(review);
        return ReviewResponse.from(saved);
    }
}

