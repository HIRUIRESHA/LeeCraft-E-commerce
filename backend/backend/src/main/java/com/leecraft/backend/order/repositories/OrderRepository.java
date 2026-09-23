package com.leecraft.backend.order.repositories;

import com.leecraft.backend.order.models.Order;
import com.leecraft.backend.order.models.OrderStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface OrderRepository extends JpaRepository<Order, Long> {

    boolean existsByOrderNumber(String orderNumber);

    Optional<Order> findByOrderNumber(String orderNumber);

    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    long countByStatus(OrderStatus status);

    @Query("""
        SELECT COALESCE(SUM(o.total), 0)
        FROM Order o
        WHERE o.status <> com.leecraft.backend.order.models.OrderStatus.CANCELLED
        """)
    BigDecimal sumRevenue();

    /**
     * Calculates sales from the supplied date until now.
     * Cancelled orders are excluded.
     */
    @Query("""
        SELECT COALESCE(SUM(o.total), 0)
        FROM Order o
        WHERE o.createdAt >= :fromDate
        AND o.createdAt <= :toDate
        AND o.status <> com.leecraft.backend.order.models.OrderStatus.CANCELLED
        """)
    BigDecimal sumRevenueBetween(
            @Param("fromDate") Instant fromDate,
            @Param("toDate") Instant toDate
    );

    /**
     * Gets the newest orders for the admin dashboard.
     */
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
