package com.javaecommerce.controller;

import com.javaecommerce.dto.cart.CartItemRequest;
import com.javaecommerce.dto.cart.CartResponse;
import com.javaecommerce.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Cart", description = "Authenticated user shopping cart")
public class CartController {

    private final CartService cartService;

    @GetMapping
    @Operation(summary = "Get the current user's cart")
    public CartResponse get() { return cartService.get(); }

    @PostMapping("/items")
    @Operation(summary = "Add an item to the cart")
    public CartResponse add(@Valid @RequestBody CartItemRequest req) {
        return cartService.addItem(req);
    }

    @PatchMapping("/items/{itemId}")
    @Operation(summary = "Update the quantity of an item")
    public CartResponse update(@PathVariable Long itemId, @RequestParam @Min(1) Integer quantity) {
        return cartService.updateItem(itemId, quantity);
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Remove an item from the cart")
    public CartResponse remove(@PathVariable Long itemId) {
        return cartService.removeItem(itemId);
    }

    @DeleteMapping
    @Operation(summary = "Clear the cart")
    public ResponseEntity<Void> clear() {
        cartService.clear();
        return ResponseEntity.noContent().build();
    }
}
