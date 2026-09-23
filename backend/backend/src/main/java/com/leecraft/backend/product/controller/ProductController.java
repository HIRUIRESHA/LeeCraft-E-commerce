package com.leecraft.backend.product.controller;

import com.leecraft.backend.product.dto.ProductRequest;
import com.leecraft.backend.product.dto.ProductResponse;
import com.leecraft.backend.product.dto.ProductStockUpdateRequest;
import com.leecraft.backend.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // tighten to your Angular dev URL later, e.g. "http://localhost:4200"
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String material,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String shape,
            @RequestParam(required = false) String color,
            @RequestParam(defaultValue = "false") boolean inStockOnly,
            @RequestParam(required = false) String sort) {
        return ResponseEntity.ok(productService.searchProducts(
                keyword, categoryId, minPrice, maxPrice, material, size, shape, color, inStockOnly, sort
        ));
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<List<ProductResponse>> getAutocomplete(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(productService.getAutocompleteSuggestions(keyword));
    }

    @GetMapping("/{id}/related")
    public ResponseEntity<List<ProductResponse>> getRelatedProducts(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getRelatedProducts(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }


    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<ProductResponse> updateStock(@PathVariable Long id, @Valid @RequestBody ProductStockUpdateRequest request) {
        return ResponseEntity.ok(productService.updateStock(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}