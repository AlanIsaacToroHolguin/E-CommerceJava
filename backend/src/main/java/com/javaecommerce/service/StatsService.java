package com.javaecommerce.service;

import com.javaecommerce.dto.stats.DashboardStats;
import com.javaecommerce.entity.Order;
import com.javaecommerce.entity.OrderStatus;
import com.javaecommerce.repository.OrderRepository;
import com.javaecommerce.repository.ProductRepository;
import com.javaecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public DashboardStats dashboard() {
        List<Order> orders = orderRepository.findAll();

        BigDecimal totalRevenue = orders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        YearMonth now = YearMonth.now();
        List<YearMonth> last6 = new ArrayList<>();
        for (int i = 5; i >= 0; i--) last6.add(now.minusMonths(i));

        Map<YearMonth, List<Order>> grouped = orders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .collect(Collectors.groupingBy(o ->
                        YearMonth.from(LocalDate.ofInstant(o.getCreatedAt(), ZoneId.systemDefault()))));

        List<DashboardStats.MonthlySales> sales = last6.stream()
                .map(ym -> {
                    List<Order> os = grouped.getOrDefault(ym, List.of());
                    BigDecimal revenue = os.stream().map(Order::getTotalAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return new DashboardStats.MonthlySales(ym.toString(), revenue, os.size());
                })
                .toList();

        return new DashboardStats(
                userRepository.count(),
                productRepository.count(),
                orderRepository.count(),
                orderRepository.countByStatus(OrderStatus.PENDING),
                totalRevenue,
                sales
        );
    }
}
