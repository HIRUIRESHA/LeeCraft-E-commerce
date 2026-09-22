package com.leecraft.backend.cart.repository;

import com.leecraft.backend.cart.model.Cart;
import com.leecraft.backend.cart.model.CartItem;
import com.leecraft.backend.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByCartAndProduct(
            Cart cart,
            Product product
    );
}