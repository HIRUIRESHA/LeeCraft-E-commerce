package com.leecraft.backend.order.dto;

import com.leecraft.backend.order.ContactMethod;
import com.leecraft.backend.order.Order;
import com.leecraft.backend.order.OrderStatus;
import com.leecraft.backend.order.ShippingMethod;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        String id,
        OrderStatus status,
        String fullName,
        String email,
        String contactNumber,
        String address,
        String city,
        String postalCode,
        ShippingMethod shippingMethod,
        ContactMethod contactPreference,
        BigDecimal subtotal,
        BigDecimal shippingCost,
        BigDecimal total,
        Instant createdAt,
        List<OrderItemResponse> items,
        String whatsappLink
) {
    public static OrderResponse from(Order order, String whatsappLink) {
        return new OrderResponse(
                order.getOrderNumber(),
                order.getStatus(),
                order.getFullName(),
                order.getEmail(),
                order.getContactNumber(),
                order.getAddress(),
                order.getCity(),
                order.getPostalCode(),
                order.getShippingMethod(),
                order.getContactPreference(),
                order.getSubtotal(),
                order.getShippingCost(),
                order.getTotal(),
                order.getCreatedAt(),
                order.getItems().stream().map(OrderItemResponse::from).toList(),
                whatsappLink
        );
    }
}
