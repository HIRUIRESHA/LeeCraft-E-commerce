package com.leecraft.backend.order.dto;

import com.leecraft.backend.order.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusUpdateRequest(@NotNull OrderStatus status) {
}
