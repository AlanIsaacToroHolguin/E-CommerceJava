package com.javaecommerce.entity;

import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

public enum OrderStatus {
    PENDING,
    PROCESSING,
    SHIPPED,
    DELIVERED,
    CANCELLED;

    private static final Map<OrderStatus, Set<OrderStatus>> TRANSITIONS = Map.of(
            PENDING,    EnumSet.of(PROCESSING, CANCELLED),
            PROCESSING, EnumSet.of(SHIPPED, CANCELLED),
            SHIPPED,    EnumSet.of(DELIVERED),
            DELIVERED,  EnumSet.noneOf(OrderStatus.class),
            CANCELLED,  EnumSet.noneOf(OrderStatus.class)
    );

    public boolean canTransitionTo(OrderStatus target) {
        return TRANSITIONS.getOrDefault(this, Set.of()).contains(target);
    }
}
