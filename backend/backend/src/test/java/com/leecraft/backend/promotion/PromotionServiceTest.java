package com.leecraft.backend.promotion;

import com.leecraft.backend.promotion.dto.PromotionRequest;
import com.leecraft.backend.promotion.model.Promotion;
import com.leecraft.backend.promotion.repository.PromotionRepository;
import com.leecraft.backend.promotion.service.PromotionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PromotionServiceTest {

    @Mock
    private PromotionRepository promotionRepository;

    @InjectMocks
    private PromotionService promotionService;

    @Test
    void shouldCreatePromotionWhenCodeIsAvailable() {
        PromotionRequest request = new PromotionRequest();
        request.setTitle("Weekend Sale");
        request.setCode("WEEKEND10");
        request.setDescription("10% off this weekend");
        request.setDiscountPercent(new BigDecimal("10.00"));
        request.setActive(true);
        request.setStartDate(LocalDate.now());
        request.setEndDate(LocalDate.now().plusDays(7));

        when(promotionRepository.existsByCodeIgnoreCase("WEEKEND10")).thenReturn(false);
        when(promotionRepository.save(any(Promotion.class))).thenAnswer(invocation -> {
            Promotion entity = invocation.getArgument(0);
            entity.setId(1L);
            return entity;
        });

        var response = promotionService.createPromotion(request);

        assertNotNull(response);
        assertEquals("WEEKEND10", response.getCode());
        assertTrue(response.isActive());
        verify(promotionRepository).save(any(Promotion.class));
    }

    @Test
    void shouldTogglePromotionStatus() {
        Promotion promotion = new Promotion();
        promotion.setId(2L);
        promotion.setTitle("Flash Sale");
        promotion.setCode("FLASH20");
        promotion.setDescription("Flash sale");
        promotion.setDiscountPercent(new BigDecimal("20.00"));
        promotion.setActive(false);
        promotion.setStartDate(LocalDate.now());
        promotion.setEndDate(LocalDate.now().plusDays(3));

        when(promotionRepository.findById(2L)).thenReturn(Optional.of(promotion));
        when(promotionRepository.save(any(Promotion.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = promotionService.togglePromotionStatus(2L);

        assertTrue(response.isActive());
        verify(promotionRepository).save(promotion);
    }
}
