package com.leecraft.backend.auth.dto;

public record AuthResponse(
        String token,
        Long id,
        String fullName,
        String email,
        String role
) {}