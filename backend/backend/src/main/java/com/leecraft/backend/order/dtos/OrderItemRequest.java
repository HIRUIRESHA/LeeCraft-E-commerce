package com.leecraft.backend.order.dtos;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record OrderItemRequest(
        @NotBlank String productId,
        @NotBlank String productName,
        @NotNull @DecimalMin(value = "0", inclusive = false) BigDecimal unitPrice,
        @NotNull @Min(1) Integer qty
) {
}
