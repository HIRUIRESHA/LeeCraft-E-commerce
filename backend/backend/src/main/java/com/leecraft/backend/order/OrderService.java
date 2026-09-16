package com.leecraft.backend.order;

import com.leecraft.backend.exception.OrderNotFoundException;
import com.leecraft.backend.order.dto.CheckoutRequest;
import com.leecraft.backend.order.dto.OrderItemRequest;
import com.leecraft.backend.order.dto.OrderResponse;
import com.leecraft.backend.order.dto.SalesSummaryResponse;
import com.leecraft.backend.whatsapp.WhatsAppLinkService;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.EnumMap;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final OrderRepository orderRepository;
    private final WhatsAppLinkService whatsAppLinkService;

    public OrderService(OrderRepository orderRepository, WhatsAppLinkService whatsAppLinkService) {
        this.orderRepository = orderRepository;
        this.whatsAppLinkService = whatsAppLinkService;
    }

    @Transactional
    public OrderResponse placeOrder(CheckoutRequest request) {
        Order order = new Order();
        order.setFullName(request.fullName());
        order.setEmail(request.email());
        order.setContactNumber(request.contactNumber());
        order.setAddress(request.address());
        order.setCity(request.city());
        order.setPostalCode(request.postalCode());
        order.setShippingMethod(request.shippingMethod());
        order.setContactPreference(request.contactPreference());
        order.setOrderNumber(generateOrderNumber());

        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderItemRequest itemRequest : request.items()) {
            OrderItem item = new OrderItem();
            item.setProductId(itemRequest.productId());
            item.setProductName(itemRequest.productName());
            item.setUnitPrice(itemRequest.unitPrice());
            item.setQty(itemRequest.qty());
            item.setLineTotal(itemRequest.unitPrice().multiply(BigDecimal.valueOf(itemRequest.qty())));
            order.addItem(item);
            subtotal = subtotal.add(item.getLineTotal());
        }

        BigDecimal shippingCost = request.shippingMethod().cost();
        order.setSubtotal(subtotal);
        order.setShippingCost(shippingCost);
        order.setTotal(subtotal.add(shippingCost));

        Order saved = orderRepository.save(order);
        return OrderResponse.from(saved, whatsAppLinkService.newOrderNotificationLink(saved));
    }

    @Transactional(readOnly = true)
    public OrderResponse getByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new OrderNotFoundException(orderNumber));
        return OrderResponse.from(order, whatsAppLinkService.customerContactLink(order));
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> list(OrderStatus status, Pageable pageable) {
        Page<Order> page = status == null
                ? orderRepository.findAll(pageable)
                : orderRepository.findByStatus(status, pageable);
        return page.map(order -> OrderResponse.from(order, whatsAppLinkService.customerContactLink(order)));
    }

    @Transactional
    public OrderResponse updateStatus(String orderNumber, OrderStatus status) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new OrderNotFoundException(orderNumber));
        order.setStatus(status);
        return OrderResponse.from(order, whatsAppLinkService.customerContactLink(order));
    }

    @Transactional(readOnly = true)
    public SalesSummaryResponse salesSummary() {
        Map<OrderStatus, Long> byStatus = new EnumMap<>(OrderStatus.class);
        for (OrderStatus status : OrderStatus.values()) {
            byStatus.put(status, orderRepository.countByStatus(status));
        }
        BigDecimal revenue = orderRepository.sumRevenue();
        return new SalesSummaryResponse(orderRepository.count(), revenue, byStatus);
    }

    private String generateOrderNumber() {
        String candidate;
        do {
            candidate = "LC-" + (10000 + RANDOM.nextInt(90000));
        } while (orderRepository.existsByOrderNumber(candidate));
        return candidate;
    }
}
