package com.leecraft.backend.product.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private String material;
    private String size;
    private String shape;
    private String color;
    private Integer stockQuantity;
    private Long categoryId;
    private String categoryName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Double rating = 0.0;
    private Long reviewCount = 0L;

    public ProductResponse() {}

    public ProductResponse(Long id, String name, String description, BigDecimal price,
                           String imageUrl, String material, String size, String shape, String color,
                           Integer stockQuantity, Long categoryId, String categoryName,
                           LocalDateTime createdAt, LocalDateTime updatedAt) {
        this(id, name, description, price, imageUrl, material, size, shape, color, stockQuantity,
                categoryId, categoryName, createdAt, updatedAt, 0.0, 0L);
    }

    public ProductResponse(Long id, String name, String description, BigDecimal price,
                           String imageUrl, String material, String size, String shape, String color,
                           Integer stockQuantity, Long categoryId, String categoryName,
                           LocalDateTime createdAt, LocalDateTime updatedAt,
                           Double rating, Long reviewCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.material = material;
        this.size = size;
        this.shape = shape;
        this.color = color;
        this.stockQuantity = stockQuantity;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.rating = rating != null ? rating : 0.0;
        this.reviewCount = reviewCount != null ? reviewCount : 0L;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
    public String getShape() { return shape; }
    public void setShape(String shape) { this.shape = shape; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Long getReviewCount() { return reviewCount; }
    public void setReviewCount(Long reviewCount) { this.reviewCount = reviewCount; }
}