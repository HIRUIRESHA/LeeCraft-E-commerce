package com.leecraft.backend.admin.dashboard;

import com.leecraft.backend.admin.dashboard.dto.AnalyticsResponse;
import com.leecraft.backend.admin.dashboard.dto.ProductSalesDto;
import com.leecraft.backend.admin.dashboard.dto.RevenueDataDto;
import com.leecraft.backend.order.models.Order;
import com.leecraft.backend.order.models.OrderItem;
import com.leecraft.backend.order.models.OrderStatus;
import com.leecraft.backend.order.repositories.OrderItemRepository;
import com.leecraft.backend.order.repositories.OrderRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class AdminAnalyticsService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public AdminAnalyticsService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    /**
     * Main analytics method.
     */
    public AnalyticsResponse getAnalytics() {

        // Get all orders
        List<Order> orders =
                orderRepository.findAll();

        // Get all order items
        List<OrderItem> orderItems =
                orderItemRepository.findAll();

        // Build revenue and order-volume data
        List<RevenueDataDto> revenue =
                buildRevenueData(orders);

        // Build top-selling product data
        List<ProductSalesDto> topSellingProducts =
                buildProductSales(orderItems);

        return new AnalyticsResponse(
                revenue,
                topSellingProducts
        );
    }

    /**
     * Creates revenue and order-volume data
     * for the last 30 days.
     */
    private List<RevenueDataDto> buildRevenueData(
            List<Order> orders
    ) {

        Map<String, BigDecimal> revenueMap =
                new LinkedHashMap<>();

        Map<String, Long> orderCountMap =
                new LinkedHashMap<>();

        ZoneId zone =
                ZoneId.systemDefault();

        DateTimeFormatter formatter =
                DateTimeFormatter
                        .ofPattern("yyyy-MM-dd")
                        .withZone(zone);

        Instant now =
                Instant.now();

        Instant from =
                now.minus(
                        30,
                        ChronoUnit.DAYS
                );

        /*
         * Create entries for all 30 days.
         *
         * This means the chart will still show
         * a date even if there were zero orders.
         */
        for (int i = 29; i >= 0; i--) {

            Instant date =
                    now.minus(
                            i,
                            ChronoUnit.DAYS
                    );

            String period =
                    formatter.format(date);

            revenueMap.put(
                    period,
                    BigDecimal.ZERO
            );

            orderCountMap.put(
                    period,
                    0L
            );
        }

        /*
         * Add actual order information.
         */
        for (Order order : orders) {

            // Ignore orders without a creation date
            if (order.getCreatedAt() == null) {
                continue;
            }

            // Ignore orders older than 30 days
            if (order.getCreatedAt().isBefore(from)) {
                continue;
            }

            // Ignore cancelled orders
            if (order.getStatus() ==
                    OrderStatus.CANCELLED) {

                continue;
            }

            String period =
                    formatter.format(
                            order.getCreatedAt()
                    );

            BigDecimal currentRevenue =
                    revenueMap.get(period);

            /*
             * This protects against an order being
             * outside the generated 30-day keys.
             */
            if (currentRevenue == null) {
                continue;
            }

            BigDecimal orderTotal =
                    order.getTotal();

            if (orderTotal == null) {
                orderTotal = BigDecimal.ZERO;
            }

            // Add revenue
            revenueMap.put(
                    period,
                    currentRevenue.add(orderTotal)
            );

            // Add order count
            orderCountMap.put(
                    period,
                    orderCountMap.get(period) + 1
            );
        }

        /*
         * Convert maps into DTO list.
         */
        List<RevenueDataDto> result =
                new ArrayList<>();

        for (String period :
                revenueMap.keySet()) {

            result.add(
                    new RevenueDataDto(
                            period,
                            revenueMap.get(period),
                            orderCountMap.get(period)
                    )
            );
        }

        return result;
    }

    /**
     * Creates top-selling product data.
     *
     * Product quantities are taken from OrderItem.
     */
    private List<ProductSalesDto> buildProductSales(
            List<OrderItem> orderItems
    ) {

        Map<String, ProductSalesData> salesMap =
                new HashMap<>();

        for (OrderItem item : orderItems) {

            /*
             * Ignore invalid order items.
             */
            if (item.getOrder() == null) {
                continue;
            }

            /*
             * Cancelled orders should not contribute
             * to sales analytics.
             */
            if (item.getOrder().getStatus()
                    == OrderStatus.CANCELLED) {

                continue;
            }

            String productId =
                    item.getProductId();

            String productName =
                    item.getProductName();

            if (productId == null) {
                productId = "";
            }

            if (productName == null
                    || productName.isBlank()) {

                productName =
                        "Unknown Product";
            }

            long quantity =
                    item.getQty() != null
                            ? item.getQty()
                            : 0;

            ProductSalesData existing =
                    salesMap.get(productId);

            if (existing == null) {

                salesMap.put(
                        productId,
                        new ProductSalesData(
                                productId,
                                productName,
                                quantity
                        )
                );

            } else {

                existing.addQuantity(quantity);
            }
        }

        /*
         * Sort products from highest quantity
         * sold to lowest quantity sold.
         */
        return salesMap.values()
                .stream()
                .sorted(
                        Comparator.comparingLong(
                                ProductSalesData::getQuantity
                        ).reversed()
                )
                .limit(10)
                .map(
                        data ->
                                new ProductSalesDto(
                                        data.getProductId(),
                                        data.getProductName(),
                                        data.getQuantity()
                                )
                )
                .toList();
    }

    /**
     * Internal class used to aggregate
     * product sales quantities.
     */
    private static class ProductSalesData {

        private final String productId;

        private final String productName;

        private long quantity;

        private ProductSalesData(
                String productId,
                String productName,
                long quantity
        ) {

            this.productId = productId;

            this.productName = productName;

            this.quantity = quantity;
        }

        /**
         * Add more sold quantity.
         */
        public void addQuantity(
                long quantity
        ) {

            this.quantity += quantity;
        }

        /**
         * Get product ID.
         */
        public String getProductId() {

            return productId;
        }

        /**
         * Get product name.
         */
        public String getProductName() {

            return productName;
        }

        /**
         * Get quantity sold.
         */
        public long getQuantity() {

            return quantity;
        }
    }
}