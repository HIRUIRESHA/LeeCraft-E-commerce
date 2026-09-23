package com.leecraft.backend.wishlist.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistItemResponse {

    private Long productId;

    private String name;

    private BigDecimal price;

    private String image;
}