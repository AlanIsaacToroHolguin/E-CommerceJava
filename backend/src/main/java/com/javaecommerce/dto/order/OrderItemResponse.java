package com.javaecommerce.dto.order;

import com.javaecommerce.entity.OrderItem;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        Long productId,
        String productName,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal subtotal
) {
    public static OrderItemResponse from(OrderItem oi) {
        return new OrderItemResponse(
                oi.getId(), oi.getProduct().getId(), oi.getProductName(),
                oi.getQuantity(), oi.getUnitPrice(), oi.getSubtotal()
        );
    }
}
