package com.leecraft.backend.admin.dashboard;

import com.leecraft.backend.admin.dashboard.dto.AnalyticsResponse;
import com.leecraft.backend.admin.dashboard.dto.DashboardResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;
    private final AdminAnalyticsService analyticsService;

    public AdminDashboardController(
            AdminDashboardService dashboardService,
            AdminAnalyticsService analyticsService
    ) {
        this.dashboardService = dashboardService;
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public DashboardResponse getDashboard() {
        return dashboardService.getDashboard();
    }

    @GetMapping("/analytics")
    public AnalyticsResponse getAnalytics() {
        return analyticsService.getAnalytics();
    }
}