package com.leecraft.backend.promotion.controller;

import com.leecraft.backend.promotion.dto.PromotionResponse;
import com.leecraft.backend.promotion.dto.PromotionValidationRequest;
import com.leecraft.backend.promotion.dto.PromotionValidationResponse;
import com.leecraft.backend.promotion.service.PromotionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "*")
public class PromotionController {

    private final PromotionService promotionService;

    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    @GetMapping
    public ResponseEntity<List<PromotionResponse>> getActivePromotions() {
        return ResponseEntity.ok(promotionService.getActivePromotions());
    }

    @PostMapping("/validate")
    public ResponseEntity<PromotionValidationResponse> validatePromotion(
            @Valid @RequestBody PromotionValidationRequest request) {
        PromotionValidationResponse response = promotionService.validatePromotionCode(
                request.getCode(),
                request.getOrderAmount()
        );
        return ResponseEntity.ok(response);
    }
}
