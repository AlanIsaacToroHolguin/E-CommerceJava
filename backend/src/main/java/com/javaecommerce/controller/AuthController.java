package com.javaecommerce.controller;

import com.javaecommerce.dto.auth.AuthResponse;
import com.javaecommerce.dto.auth.LoginRequest;
import com.javaecommerce.dto.auth.RefreshTokenRequest;
import com.javaecommerce.dto.auth.RegisterRequest;
import com.javaecommerce.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Authentication endpoints (register, login, refresh)")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new customer account")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(req));
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email and password")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Exchange a refresh token for a new access token")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest req) {
        return ResponseEntity.ok(authService.refresh(req));
    }
}
