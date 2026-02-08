package com.javaecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_products_name", columnList = "name"),
        @Index(name = "idx_products_brand", columnList = "brand")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 80)
    private String brand;

    @Column(name = "model_code", length = 80)
    private String modelCode;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(length = 50)
    private String color;

    @Column(name = "body_wood", length = 50)
    private String bodyWood;

    @Column(name = "neck_wood", length = 50)
    private String neckWood;

    @Column(name = "fingerboard", length = 50)
    private String fingerboard;

    @Column(name = "pickup_config", length = 30)
    private String pickupConfig;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    public boolean hasStock(int quantity) {
        return stock != null && stock >= quantity;
    }

    public void decreaseStock(int quantity) {
        if (!hasStock(quantity)) {
            throw new IllegalStateException("Insufficient stock for product: " + name);
        }
        this.stock -= quantity;
    }
}
