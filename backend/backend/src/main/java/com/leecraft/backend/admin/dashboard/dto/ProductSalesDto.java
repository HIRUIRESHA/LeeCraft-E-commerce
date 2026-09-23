package com.leecraft.backend.admin.dashboard.dto;

public class ProductSalesDto {

    private String productId;
    private String productName;
    private long quantity;

    public ProductSalesDto(
            String productId,
            String productName,
            long quantity
    ) {
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
    }

    public String getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public long getQuantity() {
        return quantity;
    }
}