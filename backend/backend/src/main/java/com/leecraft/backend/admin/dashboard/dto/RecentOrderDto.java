package com.leecraft.backend.admin.dashboard.dto;

import java.math.BigDecimal;

public class RecentOrderDto {

    private Long id;
    private String customerName;
    private BigDecimal total;
    private String status;

    public RecentOrderDto(
            Long id,
            String customerName,
            BigDecimal total,
            String status
    ) {
        this.id = id;
        this.customerName = customerName;
        this.total = total;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public String getStatus() {
        return status;
    }
}