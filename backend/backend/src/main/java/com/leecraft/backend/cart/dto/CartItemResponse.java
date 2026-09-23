package com.leecraft.backend.cart.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {

    private Long productId;

    private String name;

    private BigDecimal price;

    private String image;

    private Integer quantity;
}