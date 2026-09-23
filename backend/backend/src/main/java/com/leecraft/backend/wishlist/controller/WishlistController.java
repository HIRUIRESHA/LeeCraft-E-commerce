package com.leecraft.backend.wishlist.controller;

import com.leecraft.backend.wishlist.dto.WishlistResponse;
import com.leecraft.backend.wishlist.service.WishlistService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(
            WishlistService wishlistService
    ) {
        this.wishlistService = wishlistService;
    }

    /**
     * Get current user's wishlist.
     */
    @GetMapping
    public ResponseEntity<WishlistResponse> getWishlist() {

        return ResponseEntity.ok(
                wishlistService.getWishlist()
        );
    }

    /**
     * Add product to wishlist.
     */
    @PostMapping("/items/{productId}")
    public ResponseEntity<WishlistResponse> addToWishlist(
            @PathVariable Long productId
    ) {

        return ResponseEntity.ok(
                wishlistService.addToWishlist(productId)
        );
    }

    /**
     * Remove product from wishlist.
     */
    @DeleteMapping("/items/{productId}")
    public ResponseEntity<WishlistResponse> removeFromWishlist(
            @PathVariable Long productId
    ) {

        return ResponseEntity.ok(
                wishlistService.removeFromWishlist(productId)
        );
    }

    /**
     * Clear entire wishlist.
     */
    @DeleteMapping
    public ResponseEntity<Void> clearWishlist() {

        wishlistService.clearWishlist();

        return ResponseEntity.noContent().build();
    }
}