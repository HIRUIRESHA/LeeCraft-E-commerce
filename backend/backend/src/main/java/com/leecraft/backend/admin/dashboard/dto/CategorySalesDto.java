package com.leecraft.backend.admin.dashboard.dto;

public class CategorySalesDto {

    private Long categoryId;
    private String categoryName;
    private long quantity;

    public CategorySalesDto(
            Long categoryId,
            String categoryName,
            long quantity
    ) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.quantity = quantity;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public long getQuantity() {
        return quantity;
    }
}