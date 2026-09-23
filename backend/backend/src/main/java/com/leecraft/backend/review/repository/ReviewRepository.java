package com.leecraft.backend.review.repository;

import com.leecraft.backend.review.model.Review;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);

    long countByProductId(Long productId);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRatingForProduct(@Param("productId") Long productId);

    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.product.id = :productId GROUP BY r.rating")
    List<Object[]> getRatingDistributionForProduct(@Param("productId") Long productId);

    @Query("SELECT r FROM Review r LEFT JOIN FETCH r.product ORDER BY r.rating DESC, r.createdAt DESC")
    List<Review> findTopReviews(Pageable pageable);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r")
    Double getOverallAverageRating();

    @Query("SELECT COUNT(r) FROM Review r WHERE r.rating = 5")
    long countFiveStarReviews();
}

