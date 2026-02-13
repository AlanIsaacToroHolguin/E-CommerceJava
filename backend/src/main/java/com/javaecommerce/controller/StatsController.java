package com.javaecommerce.controller;

import com.javaecommerce.dto.stats.DashboardStats;
import com.javaecommerce.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/stats")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Stats", description = "Admin dashboard statistics")
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Aggregate stats for the admin dashboard")
    public DashboardStats dashboard() { return statsService.dashboard(); }
}
