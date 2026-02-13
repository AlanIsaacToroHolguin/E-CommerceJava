package com.javaecommerce.dto.product;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank @Size(max = 150) String name,
        @NotBlank @Size(max = 80) String brand,
        @Size(max = 80) String modelCode,
        @NotBlank String description,
        @NotNull @DecimalMin("0.0") BigDecimal price,
        @NotNull @Min(0) Integer stock,
        @NotBlank @Size(max = 500) String imageUrl,
        @Size(max = 50) String color,
        @Size(max = 50) String bodyWood,
        @Size(max = 50) String neckWood,
        @Size(max = 50) String fingerboard,
        @Size(max = 30) String pickupConfig,
        Boolean active,
        @NotNull Long categoryId
) {}
