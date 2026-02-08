package com.javaecommerce.service;

import com.javaecommerce.dto.common.PageResponse;
import com.javaecommerce.dto.user.UpdateUserRequest;
import com.javaecommerce.dto.user.UserResponse;
import com.javaecommerce.entity.User;
import com.javaecommerce.exception.ResourceNotFoundException;
import com.javaecommerce.repository.UserRepository;
import com.javaecommerce.security.AuthenticatedUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AuthenticatedUserProvider authProvider;

    @Transactional(readOnly = true)
    public UserResponse currentProfile() {
        return UserResponse.from(authProvider.current());
    }

    @Transactional
    public UserResponse updateProfile(UpdateUserRequest req) {
        User u = authProvider.current();
        if (req.firstName() != null) u.setFirstName(req.firstName());
        if (req.lastName() != null) u.setLastName(req.lastName());
        if (req.phone() != null) u.setPhone(req.phone());
        return UserResponse.from(userRepository.save(u));
    }

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> all(Pageable pageable) {
        return PageResponse.from(userRepository.findAll(pageable), UserResponse::from);
    }

    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        return UserResponse.from(userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id)));
    }
}
