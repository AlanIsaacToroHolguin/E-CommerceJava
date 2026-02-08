package com.javaecommerce.controller;

import com.javaecommerce.dto.common.PageResponse;
import com.javaecommerce.dto.user.UpdateUserRequest;
import com.javaecommerce.dto.user.UserResponse;
import com.javaecommerce.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Users", description = "User profile and admin user management")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get current user profile")
    public UserResponse me() { return userService.currentProfile(); }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile")
    public UserResponse updateMe(@Valid @RequestBody UpdateUserRequest req) {
        return userService.updateProfile(req);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all users (admin only)")
    public PageResponse<UserResponse> all(@PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return userService.all(pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user by ID (admin only)")
    public UserResponse byId(@PathVariable Long id) {
        return userService.findById(id);
    }
}
