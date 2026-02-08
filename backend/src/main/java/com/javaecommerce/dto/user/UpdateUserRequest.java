package com.javaecommerce.dto.user;

import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
        @Size(max = 80) String firstName,
        @Size(max = 80) String lastName,
        @Size(max = 30) String phone
) {}
