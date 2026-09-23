package com.leecraft.backend.product.repository;

import com.leecraft.backend.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Find products by category
    List<Product> findByCategoryId(Long categoryId);

    // Search and filter products
    @Query("""
        SELECT p FROM Product p
        WHERE (:keyword IS NULL OR
               LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:categoryId IS NULL OR p.category.id = :categoryId)
        AND (:minPrice IS NULL OR p.price >= :minPrice)
        AND (:maxPrice IS NULL OR p.price <= :maxPrice)
        AND (:material IS NULL OR p.material = :material)
        AND (:size IS NULL OR p.size = :size)
        AND (:shape IS NULL OR p.shape = :shape)
        AND (:color IS NULL OR p.color = :color)
        AND (:inStockOnly = false OR p.stockQuantity > 0)
        """)
    List<Product> searchProducts(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("material") String material,
            @Param("size") String size,
            @Param("shape") String shape,
            @Param("color") String color,
            @Param("inStockOnly") boolean inStockOnly
    );

    /**
     * Find products with low stock.
     *
     * Example:
     * minimumStock = 0
     * maximumStock = 5
     *
     * This returns products with stock quantities 1, 2, 3, 4, or 5.
     */
    List<Product> findByStockQuantityGreaterThanAndStockQuantityLessThanEqualOrderByStockQuantityAsc(
            Integer minimumStock,
            Integer maximumStock
    );

    /**
     * Find products that are completely out of stock.
     *
     * stockQuantity = 0
     */
    List<Product> findByStockQuantity(Integer stockQuantity);
}