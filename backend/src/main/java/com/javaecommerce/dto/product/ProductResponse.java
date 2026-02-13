package com.javaecommerce.dto.product;

import com.javaecommerce.entity.Product;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String name,
        String brand,
        String modelCode,
        String description,
        BigDecimal price,
        Integer stock,
        String imageUrl,
        String color,
        String bodyWood,
        String neckWood,
        String fingerboard,
        String pickupConfig,
        boolean active,
        Long categoryId,
        String categoryName
) {
    public static ProductResponse from(Product p) {
        return new ProductResponse(
                p.getId(), p.getName(), p.getBrand(), p.getModelCode(), p.getDescription(),
                p.getPrice(), p.getStock(), p.getImageUrl(), p.getColor(),
                p.getBodyWood(), p.getNeckWood(), p.getFingerboard(), p.getPickupConfig(),
                p.isActive(), p.getCategory().getId(), p.getCategory().getName()
        );
    }
}
