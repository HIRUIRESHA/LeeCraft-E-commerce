package com.leecraft.backend.wishlist.repository;

import com.leecraft.backend.product.model.Product;
import com.leecraft.backend.wishlist.model.Wishlist;
import com.leecraft.backend.wishlist.model.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WishlistItemRepository
        extends JpaRepository<WishlistItem, Long> {

    Optional<WishlistItem> findByWishlistAndProduct(
            Wishlist wishlist,
            Product product
    );
}