package com.leecraft.backend.order.dtos;

import com.leecraft.backend.order.models.OrderItem;
import java.math.BigDecimal;

public record OrderItemResponse(
        String productId,
        String productName,
        BigDecimal unitPrice,
        Integer qty,
        BigDecimal lineTotal
) {
    public static OrderItemResponse from(OrderItem item) {
        return new OrderItemResponse(
                item.getProductId(),
                item.getProductName(),
                item.getUnitPrice(),
                item.getQty(),
                item.getLineTotal()
        );
    }
}
