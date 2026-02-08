package com.javaecommerce.repository;

import com.javaecommerce.entity.Order;
import com.javaecommerce.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserId(Long userId, Pageable pageable);
    long countByStatus(OrderStatus status);
}
