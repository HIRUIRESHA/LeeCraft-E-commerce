package com.leecraft.backend.user.dto;

import java.time.LocalDateTime;

public record UserProfileResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String role,
        boolean emailVerified,
        LocalDateTime createdAt
) {}
