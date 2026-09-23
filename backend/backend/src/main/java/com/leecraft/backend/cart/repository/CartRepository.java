package com.leecraft.backend.cart.repository;

import com.leecraft.backend.cart.model.Cart;
import com.leecraft.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUser(User user);

    Optional<Cart> findByUserId(Long userId);

    @Query("""
        SELECT COUNT(DISTINCT c.id)
        FROM Cart c
        JOIN c.items i
        """)
    long countAbandonedCarts();
}