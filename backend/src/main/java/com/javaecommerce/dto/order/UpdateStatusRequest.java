package com.javaecommerce.dto.order;

import com.javaecommerce.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateStatusRequest(@NotNull OrderStatus status) {}
