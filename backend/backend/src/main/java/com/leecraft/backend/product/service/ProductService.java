package com.leecraft.backend.product.service;

import com.leecraft.backend.category.model.Category;
import com.leecraft.backend.category.repository.CategoryRepository;
import com.leecraft.backend.product.dto.ProductRequest;
import com.leecraft.backend.product.dto.ProductResponse;
import com.leecraft.backend.product.dto.ProductStockUpdateRequest;
import com.leecraft.backend.product.model.Product;
import com.leecraft.backend.product.repository.ProductRepository;
import com.leecraft.backend.review.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          ReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.reviewRepository = reviewRepository;
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
                                                boolean inStockOnly, String sort) {
        List<ProductResponse> responses = productRepository.searchProducts(
                keyword, categoryId, minPrice, maxPrice, material, size, shape, color, inStockOnly
        ).stream().map(this::toResponse).collect(Collectors.toList());

        if (sort != null) {
            switch (sort.toLowerCase()) {
                case "price-asc" -> responses.sort(Comparator.comparing(ProductResponse::getPrice));
                case "price-desc" -> responses.sort(Comparator.comparing(ProductResponse::getPrice).reversed());
                case "rating" -> responses.sort(Comparator.comparing(ProductResponse::getRating).reversed()
                        .thenComparing(ProductResponse::getReviewCount).reversed());
                case "newest" -> responses.sort(Comparator.comparing(
                        ProductResponse::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())
                ));
                default -> {}
            }
        }
        return responses;
    }

    public List<ProductResponse> getAutocompleteSuggestions(String keyword) {
        if (keyword == null || keyword.trim().isBlank()) {
            return List.of();
        }
        return productRepository.searchProducts(keyword.trim(), null, null, null, null, null, null, null, false)
                .stream()
                .limit(6)
                .map(this::toResponse)
                .toList();
    }

    public List<ProductResponse> getRelatedProducts(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        Long categoryId = product.getCategory().getId();
        List<Product> categoryProducts = productRepository.findByCategoryId(categoryId).stream()
                .filter(p -> !p.getId().equals(productId))
                .limit(8)
                .toList();

        if (categoryProducts.size() < 4) {
            List<Product> additional = productRepository.findAll().stream()
                    .filter(p -> !p.getId().equals(productId) && !categoryProducts.contains(p))
                    .limit(4 - categoryProducts.size())
                    .toList();
            List<Product> combined = new ArrayList<>(categoryProducts);
            combined.addAll(additional);
            return combined.stream().map(this::toResponse).toList();
        }
        return categoryProducts.stream().map(this::toResponse).toList();
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
        Double rawAvg = reviewRepository.getAverageRatingForProduct(product.getId());
        double avgRating = rawAvg != null
                ? BigDecimal.valueOf(rawAvg).setScale(1, RoundingMode.HALF_UP).doubleValue()
                : 0.0;
        long count = reviewRepository.countByProductId(product.getId());

        return new ProductResponse(
                product.getId(), product.getName(), product.getDescription(), product.getPrice(),
                product.getImageUrl(), product.getMaterial(), product.getSize(), product.getShape(), product.getColor(),
                product.getStockQuantity(), product.getCategory().getId(), product.getCategory().getName(),
                product.getCreatedAt(), product.getUpdatedAt(),
                avgRating, count
        );
    }
}