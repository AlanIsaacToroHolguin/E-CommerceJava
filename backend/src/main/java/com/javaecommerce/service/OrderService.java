package com.javaecommerce.service;

import com.javaecommerce.dto.common.PageResponse;
import com.javaecommerce.dto.order.CreateOrderRequest;
import com.javaecommerce.dto.order.OrderResponse;
import com.javaecommerce.entity.*;
import com.javaecommerce.exception.BadRequestException;
import com.javaecommerce.exception.ResourceNotFoundException;
import com.javaecommerce.repository.CartRepository;
import com.javaecommerce.repository.OrderRepository;
import com.javaecommerce.security.AuthenticatedUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final AuthenticatedUserProvider authProvider;

    @Transactional
    public OrderResponse createFromCart(CreateOrderRequest req) {
        User user = authProvider.current();
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Cart is empty"));
        if (cart.getItems().isEmpty()) throw new BadRequestException("Cart is empty");

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .shippingAddress(req.shippingAddress())
                .shippingCity(req.shippingCity())
                .shippingCountry(req.shippingCountry())
                .shippingZip(req.shippingZip())
                .totalAmount(BigDecimal.ZERO)
                .build();

        for (CartItem ci : cart.getItems()) {
            Product p = ci.getProduct();
            if (!p.isActive()) throw new BadRequestException("Product not available: " + p.getName());
            p.decreaseStock(ci.getQuantity());

            OrderItem oi = OrderItem.builder()
                    .product(p)
                    .productName(p.getName())
                    .quantity(ci.getQuantity())
                    .unitPrice(p.getPrice())
                    .subtotal(p.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())))
                    .build();
            order.addItem(oi);
        }
        order.setTotalAmount(
                order.getItems().stream().map(OrderItem::getSubtotal).reduce(BigDecimal.ZERO, BigDecimal::add)
        );

        Order saved = orderRepository.save(order);
        cart.clear();
        return OrderResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> myOrders(Pageable pageable) {
        User user = authProvider.current();
        return PageResponse.from(orderRepository.findByUserId(user.getId(), pageable), OrderResponse::from);
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> all(Pageable pageable) {
        return PageResponse.from(orderRepository.findAll(pageable), OrderResponse::from);
    }

    @Transactional(readOnly = true)
    public OrderResponse findById(Long id) {
        Order o = getOrThrow(id);
        User current = authProvider.current();
        if (current.getRole() != Role.ADMIN && !o.getUser().getId().equals(current.getId())) {
            throw new BadRequestException("Order does not belong to current user");
        }
        return OrderResponse.from(o);
    }

    @Transactional
    public OrderResponse updateStatus(Long id, OrderStatus newStatus) {
        Order o = getOrThrow(id);
        if (!o.getStatus().canTransitionTo(newStatus)) {
            throw new BadRequestException("Cannot transition from %s to %s".formatted(o.getStatus(), newStatus));
        }
        if (newStatus == OrderStatus.CANCELLED) {
            for (OrderItem oi : o.getItems()) {
                oi.getProduct().setStock(oi.getProduct().getStock() + oi.getQuantity());
            }
        }
        o.setStatus(newStatus);
        return OrderResponse.from(o);
    }

    private Order getOrThrow(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
    }
}
