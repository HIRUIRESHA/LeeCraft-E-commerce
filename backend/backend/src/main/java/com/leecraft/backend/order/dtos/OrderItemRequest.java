package com.leecraft.backend.order.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record OrderItemRequest(
        @NotBlank String productId,
        String productName,
        BigDecimal unitPrice,
        @NotNull @Min(1) Integer qty
) {
}
