package com.javaecommerce.dto.auth;

import com.javaecommerce.dto.user.UserResponse;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresIn,
        UserResponse user
) {}
