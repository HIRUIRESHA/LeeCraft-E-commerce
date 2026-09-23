package com.leecraft.backend.admin.dashboard;

import com.leecraft.backend.admin.dashboard.dto.DashboardProductDto;
import com.leecraft.backend.admin.dashboard.dto.DashboardResponse;
import com.leecraft.backend.admin.dashboard.dto.LowStockProductDto;
import com.leecraft.backend.admin.dashboard.dto.OutOfStockProductDto;
import com.leecraft.backend.admin.dashboard.dto.RecentOrderDto;
import com.leecraft.backend.cart.repository.CartRepository;
import com.leecraft.backend.order.models.Order;
import com.leecraft.backend.order.models.OrderItem;
import com.leecraft.backend.order.repositories.OrderItemRepository;
import com.leecraft.backend.order.repositories.OrderRepository;
import com.leecraft.backend.product.model.Product;
import com.leecraft.backend.product.repository.ProductRepository;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class AdminDashboardService {

    private static final int LOW_STOCK_THRESHOLD = 5;
    private static final int BEST_SELLING_LIMIT = 5;
    private static final int RECENT_ORDERS_LIMIT = 5;

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;

    public AdminDashboardService(
            ProductRepository productRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartRepository cartRepository
    ) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
    }

    public DashboardResponse getDashboard() {

        /*
         * ==========================================
         * 1. PRODUCT COUNT
         * ==========================================
         */
        long productCount = productRepository.count();


        /*
         * ==========================================
         * 2. ORDER COUNT
         * ==========================================
         */
        long orderCount = orderRepository.count();


        /*
         * ==========================================
         * 3. TOTAL SALES - LAST 30 DAYS
         * ==========================================
         */
        Instant now = Instant.now();

        Instant thirtyDaysAgo =
                now.minus(30, ChronoUnit.DAYS);

        BigDecimal totalSales =
                orderRepository.sumRevenueBetween(
                        thirtyDaysAgo,
                        now
                );

        if (totalSales == null) {
            totalSales = BigDecimal.ZERO;
        }


        /*
         * ==========================================
         * 4. ABANDONED CARTS
         * ==========================================
         */
        long abandonedCartCount =
                cartRepository.countAbandonedCarts();


        /*
         * ==========================================
         * 5. BEST-SELLING PRODUCTS
         * ==========================================
         */
        List<DashboardProductDto> bestSellingProducts =
                getBestSellingProducts();


        /*
         * ==========================================
         * 6. RECENT ORDERS
         * ==========================================
         */
        List<RecentOrderDto> recentOrders =
                getRecentOrders();


        /*
         * ==========================================
         * 7. LOW-STOCK PRODUCTS
         * ==========================================
         */
        List<LowStockProductDto> lowStockProducts =
                getLowStockProducts();


        /*
         * ==========================================
         * 8. OUT-OF-STOCK PRODUCTS
         * ==========================================
         */
        List<OutOfStockProductDto> outOfStockProducts =
                getOutOfStockProducts();


        /*
         * ==========================================
         * 9. CHATBOT QUESTIONS
         * ==========================================
         *
         * There is currently no chatbot-question
         * entity/repository in the backend.
         *
         * Therefore we return an empty list rather
         * than creating fake dashboard data.
         */
        List<String> topChatbotQuestions =
                Collections.emptyList();


        /*
         * ==========================================
         * FINAL RESPONSE
         * ==========================================
         */
        return new DashboardResponse(
                totalSales,
                productCount,
                orderCount,
                abandonedCartCount,
                bestSellingProducts,
                recentOrders,
                lowStockProducts,
                outOfStockProducts,
                topChatbotQuestions
        );
    }


    /**
     * Returns the best-selling products based on
     * quantities recorded in OrderItem.
     *
     * OrderItem stores productId as String and
     * productName as a snapshot, so we aggregate
     * directly from OrderItem.
     */
    private List<DashboardProductDto> getBestSellingProducts() {

        List<OrderItem> orderItems =
                orderItemRepository.findAll();

        if (orderItems.isEmpty()) {
            return Collections.emptyList();
        }

        Map<String, ProductSales> salesMap =
                new LinkedHashMap<>();

        for (OrderItem item : orderItems) {

            if (item.getOrder() != null
                    && item.getOrder().getStatus()
                    != com.leecraft.backend.order.models.OrderStatus.CANCELLED) {

                String productId =
                        item.getProductId();

                String productName =
                        item.getProductName();

                int quantity =
                        item.getQty() != null
                                ? item.getQty()
                                : 0;

                if (productId == null) {
                    productId = "";
                }

                if (productName == null
                        || productName.isBlank()) {

                    productName = "Unknown Product";
                }

                ProductSales existing =
                        salesMap.get(productId);

                if (existing == null) {

                    salesMap.put(
                            productId,
                            new ProductSales(
                                    productId,
                                    productName,
                                    quantity
                            )
                    );

                } else {

                    existing.addQuantity(quantity);
                }
            }
        }

        return salesMap.values()
                .stream()
                .sorted(
                        Comparator.comparingLong(
                                ProductSales::getSoldQuantity
                        ).reversed()
                )
                .limit(BEST_SELLING_LIMIT)
                .map(
                        sales -> new DashboardProductDto(
                                sales.getProductId(),
                                sales.getProductName(),
                                sales.getSoldQuantity()
                        )
                )
                .toList();
    }


    /**
     * Returns the newest orders.
     */
    private List<RecentOrderDto> getRecentOrders() {

        PageRequest pageRequest =
                PageRequest.of(
                        0,
                        RECENT_ORDERS_LIMIT,
                        Sort.by(
                                Sort.Direction.DESC,
                                "createdAt"
                        )
                );

        List<Order> orders =
                orderRepository
                        .findAllByOrderByCreatedAtDesc(
                                pageRequest
                        )
                        .getContent();

        List<RecentOrderDto> result =
                new ArrayList<>();

        for (Order order : orders) {

            String customerName =
                    order.getFullName();

            if (customerName == null
                    || customerName.isBlank()) {

                customerName = "Guest";
            }

            BigDecimal total =
                    order.getTotal();

            if (total == null) {
                total = BigDecimal.ZERO;
            }

            String status =
                    order.getStatus() != null
                            ? order.getStatus().name()
                            : "UNKNOWN";

            result.add(
                    new RecentOrderDto(
                            order.getId(),
                            customerName,
                            total,
                            status
                    )
            );
        }

        return result;
    }


    /**
     * Returns products with stock between
     * 1 and LOW_STOCK_THRESHOLD.
     *
     * Example:
     * stock = 1, 2, 3, 4, or 5
     */
    private List<LowStockProductDto> getLowStockProducts() {

        List<Product> products =
                productRepository
                        .findByStockQuantityGreaterThanAndStockQuantityLessThanEqualOrderByStockQuantityAsc(
                                0,
                                LOW_STOCK_THRESHOLD
                        );

        return products
                .stream()
                .map(
                        product -> new LowStockProductDto(
                                product.getId(),
                                product.getName(),
                                product.getStockQuantity()
                        )
                )
                .toList();
    }


    /**
     * Returns products with zero stock.
     */
    private List<OutOfStockProductDto> getOutOfStockProducts() {

        List<Product> products =
                productRepository
                        .findByStockQuantity(0);

        return products
                .stream()
                .map(
                        product -> new OutOfStockProductDto(
                                product.getId(),
                                product.getName()
                        )
                )
                .toList();
    }


    /**
     * Small internal class used to aggregate
     * OrderItem quantities.
     */
    private static class ProductSales {

        private final String productId;
        private final String productName;
        private long soldQuantity;

        public ProductSales(
                String productId,
                String productName,
                long soldQuantity
        ) {
            this.productId = productId;
            this.productName = productName;
            this.soldQuantity = soldQuantity;
        }

        public void addQuantity(long quantity) {
            this.soldQuantity += quantity;
        }

        public String getProductId() {
            return productId;
        }

        public String getProductName() {
            return productName;
        }

        public long getSoldQuantity() {
            return soldQuantity;
        }
    }
}