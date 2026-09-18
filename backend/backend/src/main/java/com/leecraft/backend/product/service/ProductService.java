package com.leecraft.backend.product.service;

import com.leecraft.backend.category.model.Category;
import com.leecraft.backend.category.repository.CategoryRepository;
import com.leecraft.backend.product.dto.ProductRequest;
import com.leecraft.backend.product.dto.ProductResponse;
import com.leecraft.backend.product.dto.ProductStockUpdateRequest;
import com.leecraft.backend.product.model.Product;
import com.leecraft.backend.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return toResponse(product);
    }

    public List<ProductResponse> searchProducts(String keyword, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice,
                                                String material, String size, String shape, String color,
                                                boolean inStockOnly) {
        return productRepository.searchProducts(keyword, categoryId, minPrice, maxPrice, material, size, shape, color, inStockOnly)
                .stream().map(this::toResponse).toList();
    }

    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setMaterial(request.getMaterial());
        product.setSize(request.getSize());
        product.setShape(request.getShape());
        product.setColor(request.getColor());
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(category);

        return toResponse(productRepository.save(product));
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setMaterial(request.getMaterial());
        product.setSize(request.getSize());
        product.setShape(request.getShape());
        product.setColor(request.getColor());
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(category);

        return toResponse(productRepository.save(product));
    }

    public ProductResponse updateStock(Long id, ProductStockUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        product.setStockQuantity(request.getStockQuantity());
        return toResponse(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(), product.getName(), product.getDescription(), product.getPrice(),
                product.getImageUrl(), product.getMaterial(), product.getSize(), product.getShape(), product.getColor(),
                product.getStockQuantity(), product.getCategory().getId(), product.getCategory().getName(),
                product.getCreatedAt(), product.getUpdatedAt()
        );
    }
}