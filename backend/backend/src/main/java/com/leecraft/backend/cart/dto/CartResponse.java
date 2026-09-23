package com.leecraft.backend.cart.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {

    private List<CartItemResponse> items;

    private BigDecimal subtotal;

    private BigDecimal shipping;

    private BigDecimal total;

    private Integer itemCount;
}