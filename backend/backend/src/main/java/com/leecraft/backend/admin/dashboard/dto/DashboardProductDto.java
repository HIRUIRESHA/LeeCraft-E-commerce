package com.leecraft.backend.admin.dashboard.dto;

public class DashboardProductDto {

    private String id;
    private String name;
    private long soldQuantity;

    public DashboardProductDto(
            String id,
            String name,
            long soldQuantity
    ) {
        this.id = id;
        this.name = name;
        this.soldQuantity = soldQuantity;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public long getSoldQuantity() {
        return soldQuantity;
    }
}