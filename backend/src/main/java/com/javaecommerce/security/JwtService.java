package com.javaecommerce.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private final SecretKey key;
    private final long accessTtl;
    private final long refreshTtl;

    public JwtService(
            @Value("${app.security.jwt.secret}") String secret,
            @Value("${app.security.jwt.access-token-expiration-ms}") long accessTtl,
            @Value("${app.security.jwt.refresh-token-expiration-ms}") long refreshTtl
    ) {
        this.key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret));
        this.accessTtl = accessTtl;
        this.refreshTtl = refreshTtl;
    }

    public String generateAccessToken(UserDetails user, Map<String, Object> extraClaims) {
        return buildToken(user, extraClaims, accessTtl, "access");
    }

    public String generateRefreshToken(UserDetails user) {
        return buildToken(user, new HashMap<>(), refreshTtl, "refresh");
    }

    private String buildToken(UserDetails user, Map<String, Object> claims, long ttl, String type) {
        Map<String, Object> all = new HashMap<>(claims);
        all.put("type", type);
        Date now = new Date();
        return Jwts.builder()
                .claims(all)
                .subject(user.getUsername())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + ttl))
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractType(String token) {
        return extractClaim(token, c -> (String) c.get("type"));
    }

    public boolean isValid(String token, UserDetails user) {
        return user.getUsername().equals(extractUsername(token)) && !isExpired(token);
    }

    public boolean isExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    public long getAccessTtlSeconds() { return accessTtl / 1000; }

    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
        return resolver.apply(claims);
    }
}
