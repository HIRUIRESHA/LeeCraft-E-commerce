package com.leecraft.backend.admin.dashboard.dto;

import java.math.BigDecimal;
import java.util.List;

public class AnalyticsResponse {

    private List<RevenueDataDto> revenue;
    private List<ProductSalesDto> topSellingProducts;
    private List<CategorySalesDto> topSellingCategories;

    public AnalyticsResponse(
            List<RevenueDataDto> revenue,
            List<ProductSalesDto> topSellingProducts,
            List<CategorySalesDto> topSellingCategories
    ) {
        this.revenue = revenue;
        this.topSellingProducts = topSellingProducts;
        this.topSellingCategories = topSellingCategories;
    }

    public List<RevenueDataDto> getRevenue() {
        return revenue;
    }

    public List<ProductSalesDto> getTopSellingProducts() {
        return topSellingProducts;
    }

    public List<CategorySalesDto> getTopSellingCategories() {
        return topSellingCategories;
    }
}