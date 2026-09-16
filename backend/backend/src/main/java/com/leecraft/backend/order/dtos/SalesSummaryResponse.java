package com.leecraft.backend.order.dtos;

import java.math.BigDecimal;
import java.util.Map;
import com.leecraft.backend.order.models.OrderStatus;

public record SalesSummaryResponse(
        long totalOrders,
        BigDecimal totalRevenue,
        Map<OrderStatus, Long> ordersByStatus
) {
}
