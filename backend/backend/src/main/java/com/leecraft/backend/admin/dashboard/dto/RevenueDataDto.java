package com.leecraft.backend.admin.dashboard.dto;

import java.math.BigDecimal;

public class RevenueDataDto {

    private String period;
    private BigDecimal revenue;
    private long orders;

    public RevenueDataDto(
            String period,
            BigDecimal revenue,
            long orders
    ) {
        this.period = period;
        this.revenue = revenue;
        this.orders = orders;
    }

    public String getPeriod() {
        return period;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public long getOrders() {
        return orders;
    }
}