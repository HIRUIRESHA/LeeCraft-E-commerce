package com.leecraft.backend.promotion.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class PromotionValidationRequest {

    @NotBlank(message = "Promotion code is required")
    private String code;

    @NotNull(message = "Order amount is required")
    @DecimalMin(value = "0.00", message = "Order amount cannot be negative")
    private BigDecimal orderAmount;

    public PromotionValidationRequest() {}

    public PromotionValidationRequest(String code, BigDecimal orderAmount) {
        this.code = code;
        this.orderAmount = orderAmount;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public BigDecimal getOrderAmount() { return orderAmount; }
    public void setOrderAmount(BigDecimal orderAmount) { this.orderAmount = orderAmount; }
}
