package com.leecraft.backend.order.services;

import com.leecraft.backend.exception.OrderNotFoundException;
import com.leecraft.backend.order.dtos.CheckoutRequest;
import com.leecraft.backend.order.dtos.OrderItemRequest;
import com.leecraft.backend.order.dtos.OrderResponse;
import com.leecraft.backend.order.dtos.SalesSummaryResponse;
import com.leecraft.backend.order.models.Order;
import com.leecraft.backend.order.models.OrderItem;
import com.leecraft.backend.order.models.OrderStatus;
import com.leecraft.backend.order.repositories.OrderRepository;
import com.leecraft.backend.whatsapp.WhatsAppLinkService;
import com.leecraft.backend.user.UserRepository;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import com.leecraft.backend.product.repository.ProductRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.leecraft.backend.promotion.dto.PromotionValidationResponse;
import com.leecraft.backend.promotion.service.PromotionService;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final OrderRepository orderRepository;
    private final WhatsAppLinkService whatsAppLinkService;
    private final PromotionService promotionService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        WhatsAppLinkService whatsAppLinkService,
                        PromotionService promotionService,
                        UserRepository userRepository,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.whatsAppLinkService = whatsAppLinkService;
        this.promotionService = promotionService;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
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

        if (request.email() != null && !request.email().isBlank()) {
            userRepository.findByEmailIgnoreCase(request.email().trim()).ifPresent(order::setUser);
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderItemRequest itemRequest : request.items()) {
            OrderItem item = new OrderItem();
            item.setProductId(itemRequest.productId());

            String name = itemRequest.productName();
            BigDecimal price = itemRequest.unitPrice();

            if (name == null || name.isBlank() || price == null) {
                try {
                    Long pid = Long.parseLong(itemRequest.productId().trim());
                    var productOpt = productRepository.findById(pid);
                    if (productOpt.isPresent()) {
                        var prod = productOpt.get();
                        if (name == null || name.isBlank()) {
                            name = prod.getName();
                        }
                        if (price == null) {
                            price = prod.getPrice();
                        }
                    }
                } catch (Exception ignored) {
                }
            }

            if (name == null || name.isBlank()) {
                name = "Item #" + itemRequest.productId();
            }
            if (price == null) {
                price = BigDecimal.ZERO;
            }

            item.setProductName(name);
            item.setUnitPrice(price);
            item.setQty(itemRequest.qty());
            item.setLineTotal(price.multiply(BigDecimal.valueOf(itemRequest.qty())));
            order.addItem(item);
            subtotal = subtotal.add(item.getLineTotal());
        }

        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.promoCode() != null && !request.promoCode().trim().isEmpty()) {
            PromotionValidationResponse val = promotionService.validatePromotionCode(request.promoCode(), subtotal);
            if (!val.isValid()) {
                throw new RuntimeException(val.getMessage());
            }
            discountAmount = val.getDiscountAmount();
            order.setPromoCode(val.getCode());
            order.setDiscountAmount(discountAmount);
            promotionService.incrementUsage(val.getCode());
        } else {
            order.setDiscountAmount(BigDecimal.ZERO);
        }

        BigDecimal shippingCost = request.shippingMethod().cost();
        order.setSubtotal(subtotal);
        order.setShippingCost(shippingCost);
        order.setTotal(subtotal.subtract(discountAmount).max(BigDecimal.ZERO).add(shippingCost));

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

    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(String userEmail) {
        if (userEmail == null || userEmail.isBlank()) {
            return List.of();
        }
        List<Order> orders = orderRepository.findByEmailIgnoreCaseOrderByCreatedAtDesc(userEmail.trim());
        return orders.stream()
                .map(order -> OrderResponse.from(order, whatsAppLinkService.customerContactLink(order)))
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse trackOrder(String orderNumber, String contact) {
        if (orderNumber == null || orderNumber.isBlank() || contact == null || contact.isBlank()) {
            throw new RuntimeException("Order number and email/phone are required to track order.");
        }
        Order order = orderRepository.findByOrderNumberAndContact(orderNumber.trim(), contact.trim())
                .orElseThrow(() -> new OrderNotFoundException("No order found matching " + orderNumber + " with the provided contact information."));
        return OrderResponse.from(order, whatsAppLinkService.customerContactLink(order));
    }
}
