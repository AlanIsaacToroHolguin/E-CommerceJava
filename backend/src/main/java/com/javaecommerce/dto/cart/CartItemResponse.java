package com.javaecommerce.dto.cart;

import com.javaecommerce.entity.CartItem;

import java.math.BigDecimal;

public record CartItemResponse(
        Long id,
        Long productId,
        String productName,
        String imageUrl,
        BigDecimal unitPrice,
        Integer quantity,
        BigDecimal subtotal
) {
    public static CartItemResponse from(CartItem ci) {
        return new CartItemResponse(
                ci.getId(),
                ci.getProduct().getId(),
                ci.getProduct().getName(),
                ci.getProduct().getImageUrl(),
                ci.getProduct().getPrice(),
                ci.getQuantity(),
                ci.getSubtotal()
        );
    }
}
