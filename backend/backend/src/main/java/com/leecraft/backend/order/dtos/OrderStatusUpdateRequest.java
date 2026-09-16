package com.leecraft.backend.order.dtos;

import com.leecraft.backend.order.models.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusUpdateRequest(@NotNull OrderStatus status) {
}
