package com.leecraft.backend.promotion.service;

import com.leecraft.backend.promotion.dto.PromotionRequest;
import com.leecraft.backend.promotion.dto.PromotionResponse;
import com.leecraft.backend.promotion.model.Promotion;
import com.leecraft.backend.promotion.repository.PromotionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public PromotionService(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    public List<PromotionResponse> getAllPromotions() {
        return promotionRepository.findAll().stream().map(this::toResponse).toList();
    }

    public PromotionResponse getPromotionById(Long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id: " + id));
        return toResponse(promotion);
    }

    public PromotionResponse createPromotion(PromotionRequest request) {
        String normalizedCode = request.getCode() == null ? "" : request.getCode().trim();
        if (normalizedCode.isEmpty()) {
            throw new RuntimeException("Promotion code is required");
        }
        if (promotionRepository.existsByCodeIgnoreCase(normalizedCode)) {
            throw new RuntimeException("Promotion code already exists: " + normalizedCode);
        }

        Promotion promotion = new Promotion();
        promotion.setTitle(request.getTitle());
        promotion.setCode(normalizedCode.toUpperCase());
        promotion.setDescription(request.getDescription());
        promotion.setDiscountPercent(request.getDiscountPercent());
        promotion.setActive(Boolean.TRUE.equals(request.getActive()));
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());

        return toResponse(promotionRepository.save(promotion));
    }

    public PromotionResponse updatePromotion(Long id, PromotionRequest request) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id: " + id));

        String normalizedCode = request.getCode() == null ? "" : request.getCode().trim();
        if (normalizedCode.isEmpty()) {
            throw new RuntimeException("Promotion code is required");
        }

        promotion.setTitle(request.getTitle());
        promotion.setCode(normalizedCode.toUpperCase());
        promotion.setDescription(request.getDescription());
        promotion.setDiscountPercent(request.getDiscountPercent());
        promotion.setActive(Boolean.TRUE.equals(request.getActive()));
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());

        return toResponse(promotionRepository.save(promotion));
    }

    public PromotionResponse togglePromotionStatus(Long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id: " + id));
        promotion.setActive(!promotion.isActive());
        return toResponse(promotionRepository.save(promotion));
    }

    public void deletePromotion(Long id) {
        if (!promotionRepository.existsById(id)) {
            throw new RuntimeException("Promotion not found with id: " + id);
        }
        promotionRepository.deleteById(id);
    }

    private PromotionResponse toResponse(Promotion promotion) {
        return new PromotionResponse(
                promotion.getId(),
                promotion.getTitle(),
                promotion.getCode(),
                promotion.getDescription(),
                promotion.getDiscountPercent(),
                promotion.isActive(),
                promotion.getStartDate(),
                promotion.getEndDate(),
                promotion.getCreatedAt(),
                promotion.getUpdatedAt()
        );
    }
}
