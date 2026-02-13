package com.javaecommerce.dto.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateOrderRequest(
        @NotBlank @Size(max = 300) String shippingAddress,
        @NotBlank @Size(max = 100) String shippingCity,
        @NotBlank @Size(max = 80) String shippingCountry,
        @NotBlank @Size(max = 20) String shippingZip
) {}
