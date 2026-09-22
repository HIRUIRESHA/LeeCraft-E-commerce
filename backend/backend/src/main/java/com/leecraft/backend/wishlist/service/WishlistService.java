package com.leecraft.backend.wishlist.service;

import com.leecraft.backend.product.model.Product;
import com.leecraft.backend.product.repository.ProductRepository;
import com.leecraft.backend.user.User;
import com.leecraft.backend.user.UserRepository;
import com.leecraft.backend.wishlist.dto.WishlistItemResponse;
import com.leecraft.backend.wishlist.dto.WishlistResponse;
import com.leecraft.backend.wishlist.model.Wishlist;
import com.leecraft.backend.wishlist.model.WishlistItem;
import com.leecraft.backend.wishlist.repository.WishlistRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public WishlistService(
            WishlistRepository wishlistRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // ==================================================
    // Get currently logged-in user
    // ==================================================

    private User getCurrentUser() {

        var authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "User is not authenticated"
            );
        }

        String email = authentication.getName();

        return userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "User not found"
                        )
                );
    }

    // ==================================================
    // Get or create wishlist
    // ==================================================

    private Wishlist getOrCreateWishlist() {

        User user = getCurrentUser();

        return wishlistRepository
                .findByUser(user)
                .orElseGet(() -> {

                    Wishlist wishlist =
                            Wishlist.builder()
                                    .user(user)
                                    .build();

                    return wishlistRepository.save(wishlist);
                });
    }

    // ==================================================
    // Get wishlist
    // ==================================================

    public WishlistResponse getWishlist() {

        Wishlist wishlist =
                getOrCreateWishlist();

        return buildWishlistResponse(wishlist);
    }

    // ==================================================
    // Add product to wishlist
    // ==================================================

    public WishlistResponse addToWishlist(
            Long productId
    ) {

        Wishlist wishlist =
                getOrCreateWishlist();

        Product product =
                productRepository
                        .findById(productId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Product not found"
                                )
                        );

        boolean alreadyExists =
                wishlist.getItems()
                        .stream()
                        .anyMatch(item ->
                                item.getProduct()
                                        .getId()
                                        .equals(productId)
                        );

        if (!alreadyExists) {

            WishlistItem item =
                    WishlistItem.builder()
                            .product(product)
                            .build();

            wishlist.addItem(item);

            wishlistRepository.save(wishlist);
        }

        return buildWishlistResponse(wishlist);
    }

    // ==================================================
    // Remove product from wishlist
    // ==================================================

    public WishlistResponse removeFromWishlist(
            Long productId
    ) {

        Wishlist wishlist =
                getOrCreateWishlist();

        WishlistItem item =
                wishlist.getItems()
                        .stream()
                        .filter(wishlistItem ->
                                wishlistItem
                                        .getProduct()
                                        .getId()
                                        .equals(productId)
                        )
                        .findFirst()
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Product is not in the wishlist"
                                )
                        );

        wishlist.removeItem(item);

        wishlistRepository.save(wishlist);

        return buildWishlistResponse(wishlist);
    }

    // ==================================================
    // Clear wishlist
    // ==================================================

    public void clearWishlist() {

        Wishlist wishlist =
                getOrCreateWishlist();

        wishlist.getItems().clear();

        wishlistRepository.save(wishlist);
    }

    // ==================================================
    // Build response
    // ==================================================

    private WishlistResponse buildWishlistResponse(
            Wishlist wishlist
    ) {

        List<WishlistItemResponse> items =
                wishlist.getItems()
                        .stream()
                        .map(item ->
                                WishlistItemResponse
                                        .builder()
                                        .productId(
                                                item.getProduct().getId()
                                        )
                                        .name(
                                                item.getProduct().getName()
                                        )
                                        .price(
                                                item.getProduct().getPrice()
                                        )
                                        .image(
                                                item.getProduct().getImageUrl()
                                        )
                                        .build()
                        )
                        .toList();

        return WishlistResponse
                .builder()
                .items(items)
                .itemCount(items.size())
                .build();
    }
}