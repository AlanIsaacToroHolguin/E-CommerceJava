package com.javaecommerce.security;

import com.javaecommerce.entity.User;
import com.javaecommerce.exception.BadRequestException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthenticatedUserProvider {

    public User current() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof User u)) {
            throw new BadRequestException("Not authenticated");
        }
        return u;
    }
}
