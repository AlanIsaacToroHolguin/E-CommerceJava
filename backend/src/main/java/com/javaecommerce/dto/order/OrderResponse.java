package com.javaecommerce.dto.order;

import com.javaecommerce.entity.Order;
import com.javaecommerce.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        Long userId,
        String userEmail,
        OrderStatus status,
        BigDecimal totalAmount,
        String shippingAddress,
        String shippingCity,
        String shippingCountry,
        String shippingZip,
        List<OrderItemResponse> items,
        Instant createdAt,
        Instant updatedAt
) {
    public static OrderResponse from(Order o) {
        return new OrderResponse(
                o.getId(),
                o.getUser().getId(),
                o.getUser().getEmail(),
                o.getStatus(),
                o.getTotalAmount(),
                o.getShippingAddress(),
                o.getShippingCity(),
                o.getShippingCountry(),
                o.getShippingZip(),
                o.getItems().stream().map(OrderItemResponse::from).toList(),
                o.getCreatedAt(),
                o.getUpdatedAt()
        );
    }
}
