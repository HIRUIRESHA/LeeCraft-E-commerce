package com.leecraft.backend.admin.dashboard.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardResponse {

    private BigDecimal totalSales;
    private long productCount;
    private long orderCount;
    private long abandonedCartCount;

    private List<DashboardProductDto> bestSellingProducts;
    private List<RecentOrderDto> recentOrders;
    private List<LowStockProductDto> lowStockProducts;
    private List<OutOfStockProductDto> outOfStockProducts;
    private List<String> topChatbotQuestions;

    public DashboardResponse(
            BigDecimal totalSales,
            long productCount,
            long orderCount,
            long abandonedCartCount,
            List<DashboardProductDto> bestSellingProducts,
            List<RecentOrderDto> recentOrders,
            List<LowStockProductDto> lowStockProducts,
            List<OutOfStockProductDto> outOfStockProducts,
            List<String> topChatbotQuestions
    ) {
        this.totalSales = totalSales;
        this.productCount = productCount;
        this.orderCount = orderCount;
        this.abandonedCartCount = abandonedCartCount;
        this.bestSellingProducts = bestSellingProducts;
        this.recentOrders = recentOrders;
        this.lowStockProducts = lowStockProducts;
        this.outOfStockProducts = outOfStockProducts;
        this.topChatbotQuestions = topChatbotQuestions;
    }

    public BigDecimal getTotalSales() {
        return totalSales;
    }

    public long getProductCount() {
        return productCount;
    }

    public long getOrderCount() {
        return orderCount;
    }

    public long getAbandonedCartCount() {
        return abandonedCartCount;
    }

    public List<DashboardProductDto> getBestSellingProducts() {
        return bestSellingProducts;
    }

    public List<RecentOrderDto> getRecentOrders() {
        return recentOrders;
    }

    public List<LowStockProductDto> getLowStockProducts() {
        return lowStockProducts;
    }

    public List<OutOfStockProductDto> getOutOfStockProducts() {
        return outOfStockProducts;
    }

    public List<String> getTopChatbotQuestions() {
        return topChatbotQuestions;
    }
}