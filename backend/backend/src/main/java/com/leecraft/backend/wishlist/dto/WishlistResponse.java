package com.leecraft.backend.wishlist.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistResponse {

    private List<WishlistItemResponse> items;

    private Integer itemCount;
}