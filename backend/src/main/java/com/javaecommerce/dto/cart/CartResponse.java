package com.javaecommerce.dto.cart;

import com.javaecommerce.entity.Cart;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
        Long id,
        List<CartItemResponse> items,
        BigDecimal total,
        int itemCount
) {
    public static CartResponse from(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(CartItemResponse::from).toList();
        int count = cart.getItems().stream().mapToInt(i -> i.getQuantity()).sum();
        return new CartResponse(cart.getId(), items, cart.getTotal(), count);
    }
}
