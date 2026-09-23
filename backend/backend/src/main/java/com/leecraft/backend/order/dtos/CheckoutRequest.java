package com.leecraft.backend.order.dtos;

import com.leecraft.backend.order.models.ContactMethod;
import com.leecraft.backend.order.models.ShippingMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CheckoutRequest(
        @NotBlank String fullName,
        @NotBlank @Email String email,
        @NotBlank String contactNumber,
        @NotBlank String address,
        @NotBlank String city,
        @NotBlank String postalCode,
        @NotNull ShippingMethod shippingMethod,
        @NotNull ContactMethod contactPreference,
        @NotEmpty @Valid List<OrderItemRequest> items,
        String promoCode
) {
}
