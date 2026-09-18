package com.leecraft.backend.product.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    @Size(max = 1000)
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    private String imageUrl;

    @NotBlank(message = "Material is required")
    private String material;

    @NotBlank(message = "Size is required")
    private String size;

    @NotBlank(message = "Shape is required")
    private String shape;

    @NotBlank(message = "Color is required")
    private String color;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stockQuantity;

    @NotNull(message = "Category is required")
    private Long categoryId;

    public ProductRequest() {}

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
}