package com.leecraft.backend.promotion.service;

import com.leecraft.backend.exception.PromotionNotFoundException;
import com.leecraft.backend.promotion.dto.PromotionRequest;
import com.leecraft.backend.promotion.dto.PromotionResponse;
import com.leecraft.backend.promotion.dto.PromotionValidationResponse;
import com.leecraft.backend.promotion.model.DiscountType;
import com.leecraft.backend.promotion.model.Promotion;
import com.leecraft.backend.promotion.repository.PromotionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public PromotionService(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    @Transactional(readOnly = true)
    public List<PromotionResponse> getAllPromotions() {
        return promotionRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(PromotionResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PromotionResponse> getActivePromotions() {
        return promotionRepository.findByActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(PromotionResponse::from)
                .filter(PromotionResponse::isValidNow)
                .toList();
    }

    @Transactional(readOnly = true)
    public PromotionResponse getPromotionById(Long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new PromotionNotFoundException(id));
        return PromotionResponse.from(promotion);
    }

    @Transactional
    public PromotionResponse createPromotion(PromotionRequest request) {
        validateRequest(request, null);

        Promotion promotion = new Promotion();
        copyProperties(request, promotion);

        Promotion saved = promotionRepository.save(promotion);
        return PromotionResponse.from(saved);
    }

    @Transactional
    public PromotionResponse updatePromotion(Long id, PromotionRequest request) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new PromotionNotFoundException(id));

        validateRequest(request, id);
        copyProperties(request, promotion);

        Promotion saved = promotionRepository.save(promotion);
        return PromotionResponse.from(saved);
    }

    @Transactional
    public PromotionResponse setActive(Long id, boolean active) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new PromotionNotFoundException(id));
        promotion.setActive(active);
        Promotion saved = promotionRepository.save(promotion);
        return PromotionResponse.from(saved);
    }

    @Transactional
    public void deletePromotion(Long id) {
        if (!promotionRepository.existsById(id)) {
            throw new PromotionNotFoundException(id);
        }
        promotionRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public PromotionValidationResponse validatePromotionCode(String rawCode, BigDecimal orderAmount) {
        if (rawCode == null || rawCode.trim().isEmpty()) {
            return PromotionValidationResponse.invalid("Promotion code cannot be empty.");
        }
        if (orderAmount == null || orderAmount.compareTo(BigDecimal.ZERO) < 0) {
            return PromotionValidationResponse.invalid("Order amount is invalid.");
        }

        String code = rawCode.trim().toUpperCase();
        Promotion promotion = promotionRepository.findByCodeIgnoreCase(code).orElse(null);
        if (promotion == null) {
            return PromotionValidationResponse.invalid("Promotion code '" + code + "' is not valid.");
        }

        if (!promotion.isActive()) {
            return PromotionValidationResponse.invalid("Promotion code '" + code + "' is currently inactive.");
        }

        LocalDateTime now = LocalDateTime.now();
        if (promotion.getStartDate() != null && now.isBefore(promotion.getStartDate())) {
            return PromotionValidationResponse.invalid("This promotion has not started yet.");
        }
        if (promotion.getEndDate() != null && now.isAfter(promotion.getEndDate())) {
            return PromotionValidationResponse.invalid("This promotion code has expired.");
        }

        if (promotion.getUsageLimit() != null && promotion.getUsageCount() >= promotion.getUsageLimit()) {
            return PromotionValidationResponse.invalid("This promotion code has reached its maximum usage limit.");
        }

        if (promotion.getMinOrderAmount() != null && orderAmount.compareTo(promotion.getMinOrderAmount()) < 0) {
            return PromotionValidationResponse.invalid(String.format(
                    "Minimum order subtotal of Rs. %,.2f required to use this code.",
                    promotion.getMinOrderAmount()
            ));
        }

        BigDecimal discountAmount;
        if (promotion.getDiscountType() == DiscountType.PERCENTAGE) {
            discountAmount = orderAmount.multiply(promotion.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            if (promotion.getMaxDiscountAmount() != null && discountAmount.compareTo(promotion.getMaxDiscountAmount()) > 0) {
                discountAmount = promotion.getMaxDiscountAmount();
            }
        } else {
            discountAmount = promotion.getDiscountValue();
        }

        if (discountAmount.compareTo(orderAmount) > 0) {
            discountAmount = orderAmount;
        }

        BigDecimal finalAmount = orderAmount.subtract(discountAmount).max(BigDecimal.ZERO);

        String successMessage = promotion.getDiscountType() == DiscountType.PERCENTAGE
                ? String.format("%.0f%% discount applied!", promotion.getDiscountValue())
                : String.format("Rs. %,.2f discount applied!", promotion.getDiscountValue());

        return PromotionValidationResponse.valid(
                promotion.getCode(),
                promotion.getTitle(),
                promotion.getDiscountType(),
                promotion.getDiscountValue(),
                discountAmount,
                finalAmount,
                successMessage
        );
    }

    @Transactional
    public void incrementUsage(String code) {
        if (code == null || code.trim().isEmpty()) {
            return;
        }
        promotionRepository.findByCodeIgnoreCase(code.trim()).ifPresent(promo -> {
            promo.setUsageCount(promo.getUsageCount() + 1);
            promotionRepository.save(promo);
        });
    }

    private void validateRequest(PromotionRequest request, Long existingId) {
        if (request.getCode() != null && !request.getCode().trim().isEmpty()) {
            String cleanCode = request.getCode().trim().toUpperCase();
            boolean codeTaken = existingId == null
                    ? promotionRepository.existsByCodeIgnoreCase(cleanCode)
                    : promotionRepository.existsByCodeIgnoreCaseAndIdNot(cleanCode, existingId);

            if (codeTaken) {
                throw new IllegalArgumentException("Promotion code '" + cleanCode + "' is already in use.");
            }
        }

        if (request.getDiscountType() == DiscountType.PERCENTAGE) {
            if (request.getDiscountValue().compareTo(BigDecimal.valueOf(100)) > 0) {
                throw new IllegalArgumentException("Percentage discount cannot exceed 100%.");
            }
        }

        if (request.getStartDate() != null && request.getEndDate() != null) {
            if (request.getStartDate().isAfter(request.getEndDate())) {
                throw new IllegalArgumentException("Start date cannot be after end date.");
            }
        }
    }

    private void copyProperties(PromotionRequest request, Promotion promotion) {
        promotion.setTitle(request.getTitle().trim());
        promotion.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        promotion.setCode(request.getCode());
        promotion.setDiscountType(request.getDiscountType());
        promotion.setDiscountValue(request.getDiscountValue());
        promotion.setMinOrderAmount(request.getMinOrderAmount());
        promotion.setMaxDiscountAmount(request.getMaxDiscountAmount());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setUsageLimit(request.getUsageLimit());
        promotion.setActive(request.isActive());
        promotion.setBannerUrl(request.getBannerUrl() != null ? request.getBannerUrl().trim() : null);
    }
}
