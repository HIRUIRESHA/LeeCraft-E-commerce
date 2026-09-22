package com.leecraft.backend.promotion.dto;

import com.leecraft.backend.promotion.model.DiscountType;

import java.math.BigDecimal;

public class PromotionValidationResponse {

    private boolean valid;
    private String message;
    private String code;
    private String title;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;

    public PromotionValidationResponse() {}

    public static PromotionValidationResponse invalid(String message) {
        PromotionValidationResponse response = new PromotionValidationResponse();
        response.setValid(false);
        response.setMessage(message);
        response.setDiscountAmount(BigDecimal.ZERO);
        return response;
    }

    public static PromotionValidationResponse valid(String code, String title, DiscountType discountType,
                                                     BigDecimal discountValue, BigDecimal discountAmount,
                                                     BigDecimal finalAmount, String message) {
        PromotionValidationResponse response = new PromotionValidationResponse();
        response.setValid(true);
        response.setCode(code);
        response.setTitle(title);
        response.setDiscountType(discountType);
        response.setDiscountValue(discountValue);
        response.setDiscountAmount(discountAmount);
        response.setFinalAmount(finalAmount);
        response.setMessage(message);
        return response;
    }

    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public DiscountType getDiscountType() { return discountType; }
    public void setDiscountType(DiscountType discountType) { this.discountType = discountType; }

    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getFinalAmount() { return finalAmount; }
    public void setFinalAmount(BigDecimal finalAmount) { this.finalAmount = finalAmount; }
}
