package com.leecraft.backend.promotion.repository;

import com.leecraft.backend.promotion.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    boolean existsByCodeIgnoreCase(String code);
}
