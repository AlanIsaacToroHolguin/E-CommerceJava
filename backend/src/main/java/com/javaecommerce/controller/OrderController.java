package com.javaecommerce.controller;

import com.javaecommerce.dto.common.PageResponse;
import com.javaecommerce.dto.order.CreateOrderRequest;
import com.javaecommerce.dto.order.OrderResponse;
import com.javaecommerce.dto.order.UpdateStatusRequest;
import com.javaecommerce.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Orders", description = "Order placement, history and admin management")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Create an order from the current cart")
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody CreateOrderRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createFromCart(req));
    }

    @GetMapping("/me")
    @Operation(summary = "List orders for the current user")
    public PageResponse<OrderResponse> myOrders(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return orderService.myOrders(pageable);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all orders (admin only)")
    public PageResponse<OrderResponse> all(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return orderService.all(pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get an order by ID (owner or admin)")
    public OrderResponse byId(@PathVariable Long id) {
        return orderService.findById(id);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update order status (admin only)")
    public OrderResponse updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateStatusRequest req) {
        return orderService.updateStatus(id, req.status());
    }
}
