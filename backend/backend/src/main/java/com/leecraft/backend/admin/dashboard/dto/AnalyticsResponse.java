package com.leecraft.backend.admin.dashboard.dto;

import java.util.List;

public class AnalyticsResponse {

    private List<RevenueDataDto> revenue;
    private List<ProductSalesDto> topSellingProducts;

    public AnalyticsResponse(
            List<RevenueDataDto> revenue,
            List<ProductSalesDto> topSellingProducts
    ) {
        this.revenue = revenue;
        this.topSellingProducts = topSellingProducts;
    }

    public List<RevenueDataDto> getRevenue() {
        return revenue;
    }

    public List<ProductSalesDto> getTopSellingProducts() {
        return topSellingProducts;
    }
}