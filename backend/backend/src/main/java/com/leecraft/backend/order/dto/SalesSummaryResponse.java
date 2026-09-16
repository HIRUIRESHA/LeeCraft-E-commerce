package com.leecraft.backend.order.dto;

import java.math.BigDecimal;
import java.util.Map;
import com.leecraft.backend.order.OrderStatus;

public record SalesSummaryResponse(
        long totalOrders,
        BigDecimal totalRevenue,
        Map<OrderStatus, Long> ordersByStatus
) {
}
