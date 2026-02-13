package com.javaecommerce.service;

import com.javaecommerce.dto.cart.CartItemRequest;
import com.javaecommerce.dto.cart.CartResponse;
import com.javaecommerce.entity.Cart;
import com.javaecommerce.entity.CartItem;
import com.javaecommerce.entity.Product;
import com.javaecommerce.entity.User;
import com.javaecommerce.exception.BadRequestException;
import com.javaecommerce.exception.ResourceNotFoundException;
import com.javaecommerce.repository.CartRepository;
import com.javaecommerce.repository.ProductRepository;
import com.javaecommerce.security.AuthenticatedUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final AuthenticatedUserProvider authProvider;

    @Transactional
    public CartResponse get() {
        return CartResponse.from(getOrCreate());
    }

    @Transactional
    public CartResponse addItem(CartItemRequest req) {
        Cart cart = getOrCreate();
        Product product = productRepository.findById(req.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", req.productId()));
        if (!product.isActive()) throw new BadRequestException("Product is not available");
        if (!product.hasStock(req.quantity())) throw new BadRequestException("Insufficient stock");

        cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(product.getId()))
                .findFirst()
                .ifPresentOrElse(
                        existing -> {
                            int newQty = existing.getQuantity() + req.quantity();
                            if (!product.hasStock(newQty)) throw new BadRequestException("Insufficient stock");
                            existing.setQuantity(newQty);
                        },
                        () -> cart.addItem(CartItem.builder()
                                .product(product)
                                .quantity(req.quantity())
                                .build())
                );
        return CartResponse.from(cart);
    }

    @Transactional
    public CartResponse updateItem(Long itemId, Integer quantity) {
        if (quantity < 1) throw new BadRequestException("Quantity must be >= 1");
        Cart cart = getOrCreate();
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", itemId));
        if (!item.getProduct().hasStock(quantity)) throw new BadRequestException("Insufficient stock");
        item.setQuantity(quantity);
        return CartResponse.from(cart);
    }

    @Transactional
    public CartResponse removeItem(Long itemId) {
        Cart cart = getOrCreate();
        boolean removed = cart.getItems().removeIf(i -> i.getId().equals(itemId));
        if (!removed) throw new ResourceNotFoundException("CartItem", itemId);
        return CartResponse.from(cart);
    }

    @Transactional
    public void clear() {
        Cart cart = getOrCreate();
        cart.clear();
    }

    private Cart getOrCreate() {
        User user = authProvider.current();
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart c = Cart.builder().user(user).build();
                    return cartRepository.save(c);
                });
    }
}
