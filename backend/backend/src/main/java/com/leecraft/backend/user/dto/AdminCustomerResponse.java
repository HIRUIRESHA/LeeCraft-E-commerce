package com.leecraft.backend.user.dto;

import java.time.LocalDateTime;

public record AdminCustomerResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String role,
        boolean active,
        boolean emailVerified,
        LocalDateTime createdAt
) {}
