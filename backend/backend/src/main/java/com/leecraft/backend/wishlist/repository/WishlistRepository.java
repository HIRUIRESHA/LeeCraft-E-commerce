package com.leecraft.backend.wishlist.repository;

import com.leecraft.backend.user.User;
import com.leecraft.backend.wishlist.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WishlistRepository
        extends JpaRepository<Wishlist, Long> {

    Optional<Wishlist> findByUser(User user);

    Optional<Wishlist> findByUserId(Long userId);
}