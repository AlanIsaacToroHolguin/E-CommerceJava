package com.javaecommerce.dto.user;

import com.javaecommerce.entity.Role;
import com.javaecommerce.entity.User;

import java.time.Instant;

public record UserResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        String phone,
        Role role,
        boolean enabled,
        Instant createdAt
) {
    public static UserResponse from(User u) {
        return new UserResponse(
                u.getId(), u.getEmail(), u.getFirstName(), u.getLastName(),
                u.getPhone(), u.getRole(), u.isEnabled(), u.getCreatedAt()
        );
    }
}
