package com.leecraft.backend.order;

import com.leecraft.backend.order.dto.OrderResponse;
import com.leecraft.backend.order.dto.OrderStatusUpdateRequest;
import com.leecraft.backend.order.dto.SalesSummaryResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public Page<OrderResponse> list(
            @RequestParam(required = false) OrderStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        return orderService.list(status, pageable);
    }

    @GetMapping("/{orderNumber}")
    public OrderResponse get(@PathVariable String orderNumber) {
        return orderService.getByOrderNumber(orderNumber);
    }

    @PatchMapping("/{orderNumber}/status")
    public OrderResponse updateStatus(@PathVariable String orderNumber, @Valid @RequestBody OrderStatusUpdateRequest request) {
        return orderService.updateStatus(orderNumber, request.status());
    }

    @GetMapping("/sales-summary")
    public SalesSummaryResponse salesSummary() {
        return orderService.salesSummary();
    }
}
