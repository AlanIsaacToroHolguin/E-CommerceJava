package com.javaecommerce.service;

import com.javaecommerce.dto.auth.AuthResponse;
import com.javaecommerce.dto.auth.LoginRequest;
import com.javaecommerce.dto.auth.RefreshTokenRequest;
import com.javaecommerce.dto.auth.RegisterRequest;
import com.javaecommerce.dto.user.UserResponse;
import com.javaecommerce.entity.Cart;
import com.javaecommerce.entity.Role;
import com.javaecommerce.entity.User;
import com.javaecommerce.exception.BadRequestException;
import com.javaecommerce.exception.ConflictException;
import com.javaecommerce.repository.UserRepository;
import com.javaecommerce.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new ConflictException("Email already registered");
        }
        User user = User.builder()
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .firstName(req.firstName())
                .lastName(req.lastName())
                .phone(req.phone())
                .role(Role.CUSTOMER)
                .enabled(true)
                .build();

        Cart cart = Cart.builder().user(user).build();
        user.setCart(cart);

        userRepository.save(user);
        return buildResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );
        User user = userRepository.findByEmail(req.email()).orElseThrow();
        return buildResponse(user);
    }

    public AuthResponse refresh(RefreshTokenRequest req) {
        String token = req.refreshToken();
        if (jwtService.isExpired(token) || !"refresh".equals(jwtService.extractType(token))) {
            throw new BadRequestException("Invalid or expired refresh token");
        }
        String email = jwtService.extractUsername(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));
        return buildResponse(user);
    }

    private AuthResponse buildResponse(User user) {
        Map<String, Object> claims = Map.of("role", user.getRole().name(), "uid", user.getId());
        String access = jwtService.generateAccessToken(user, claims);
        String refresh = jwtService.generateRefreshToken(user);
        return new AuthResponse(access, refresh, "Bearer", jwtService.getAccessTtlSeconds(), UserResponse.from(user));
    }
}
