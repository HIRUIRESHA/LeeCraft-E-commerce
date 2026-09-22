package com.leecraft.backend.cart.controller;

import com.leecraft.backend.cart.dto.AddToCartRequest;
import com.leecraft.backend.cart.dto.CartResponse;
import com.leecraft.backend.cart.dto.UpdateCartRequest;
import com.leecraft.backend.cart.service.CartService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * Get current user's cart.
     */
    @GetMapping
    public ResponseEntity<CartResponse> getCart() {

        return ResponseEntity.ok(
                cartService.getCart()
        );
    }

    /**
     * Add product to cart.
     */
    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(
            @Valid @RequestBody AddToCartRequest request
    ) {

        return ResponseEntity.ok(
                cartService.addToCart(request)
        );
    }

    /**
     * Update product quantity.
     */
    @PutMapping("/items/{productId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Long productId,
            @Valid @RequestBody UpdateCartRequest request
    ) {

        return ResponseEntity.ok(
                cartService.updateCartItem(
                        productId,
                        request
                )
        );
    }

    /**
     * Remove product from cart.
     */
    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartResponse> removeCartItem(
            @PathVariable Long productId
    ) {

        return ResponseEntity.ok(
                cartService.removeCartItem(productId)
        );
    }

    /**
     * Clear entire cart.
     */
    @DeleteMapping
    public ResponseEntity<Void> clearCart() {

        cartService.clearCart();

        return ResponseEntity.noContent().build();
    }
}