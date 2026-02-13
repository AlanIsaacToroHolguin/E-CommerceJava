package com.javaecommerce.dto.stats;

import java.math.BigDecimal;
import java.util.List;

public record DashboardStats(
        long totalUsers,
        long totalProducts,
        long totalOrders,
        long pendingOrders,
        BigDecimal totalRevenue,
        List<MonthlySales> salesByMonth
) {
    public record MonthlySales(String month, BigDecimal revenue, long orders) {}
}
