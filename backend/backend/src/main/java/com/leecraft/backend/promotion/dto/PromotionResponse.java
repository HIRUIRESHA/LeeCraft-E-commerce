package com.leecraft.backend.promotion.dto;

import com.leecraft.backend.promotion.model.DiscountType;
import com.leecraft.backend.promotion.model.Promotion;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PromotionResponse {

    private Long id;
    private String title;
    private String description;
    private String code;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal minOrderAmount;
    private BigDecimal maxDiscountAmount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer usageLimit;
    private int usageCount;
    private boolean active;
    private boolean validNow;
    private String bannerUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PromotionResponse() {}

    public static PromotionResponse from(Promotion promotion) {
        PromotionResponse response = new PromotionResponse();
        response.setId(promotion.getId());
        response.setTitle(promotion.getTitle());
        response.setDescription(promotion.getDescription());
        response.setCode(promotion.getCode());
        response.setDiscountType(promotion.getDiscountType());
        response.setDiscountValue(promotion.getDiscountValue());
        response.setMinOrderAmount(promotion.getMinOrderAmount());
        response.setMaxDiscountAmount(promotion.getMaxDiscountAmount());
        response.setStartDate(promotion.getStartDate());
        response.setEndDate(promotion.getEndDate());
        response.setUsageLimit(promotion.getUsageLimit());
        response.setUsageCount(promotion.getUsageCount());
        response.setActive(promotion.isActive());
        response.setBannerUrl(promotion.getBannerUrl());
        response.setCreatedAt(promotion.getCreatedAt());
        response.setUpdatedAt(promotion.getUpdatedAt());

        LocalDateTime now = LocalDateTime.now();
        boolean dateValid = (promotion.getStartDate() == null || !now.isBefore(promotion.getStartDate()))
                && (promotion.getEndDate() == null || !now.isAfter(promotion.getEndDate()));
        boolean usageValid = promotion.getUsageLimit() == null || promotion.getUsageCount() < promotion.getUsageLimit();
        response.setValidNow(promotion.isActive() && dateValid && usageValid);

        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public DiscountType getDiscountType() { return discountType; }
    public void setDiscountType(DiscountType discountType) { this.discountType = discountType; }

    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }

    public BigDecimal getMinOrderAmount() { return minOrderAmount; }
    public void setMinOrderAmount(BigDecimal minOrderAmount) { this.minOrderAmount = minOrderAmount; }

    public BigDecimal getMaxDiscountAmount() { return maxDiscountAmount; }
    public void setMaxDiscountAmount(BigDecimal maxDiscountAmount) { this.maxDiscountAmount = maxDiscountAmount; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }

    public int getUsageCount() { return usageCount; }
    public void setUsageCount(int usageCount) { this.usageCount = usageCount; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public boolean isValidNow() { return validNow; }
    public void setValidNow(boolean validNow) { this.validNow = validNow; }

    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
