package com.leecraft.backend.user.dto;

public record AddressResponse(
        Long id,
        String recipientName,
        String phone,
        String streetAddress,
        String city,
        String postalCode,
        boolean isDefault
) {}
