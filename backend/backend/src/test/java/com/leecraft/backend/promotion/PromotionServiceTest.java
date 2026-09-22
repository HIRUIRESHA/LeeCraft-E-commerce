package com.leecraft.backend.promotion;

import com.leecraft.backend.exception.PromotionNotFoundException;
import com.leecraft.backend.promotion.dto.PromotionRequest;
import com.leecraft.backend.promotion.dto.PromotionResponse;
import com.leecraft.backend.promotion.dto.PromotionValidationResponse;
import com.leecraft.backend.promotion.model.DiscountType;
import com.leecraft.backend.promotion.model.Promotion;
import com.leecraft.backend.promotion.repository.PromotionRepository;
import com.leecraft.backend.promotion.service.PromotionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PromotionServiceTest {

    @Mock
    private PromotionRepository promotionRepository;

    @InjectMocks
    private PromotionService promotionService;

    private Promotion testPromo;

    @BeforeEach
    void setUp() {
        testPromo = new Promotion();
        testPromo.setId(1L);
        testPromo.setTitle("Welcome Discount");
        testPromo.setDescription("Get 10% off");
        testPromo.setCode("WELCOME10");
        testPromo.setDiscountType(DiscountType.PERCENTAGE);
        testPromo.setDiscountValue(BigDecimal.valueOf(10.00));
        testPromo.setMinOrderAmount(BigDecimal.valueOf(1000.00));
        testPromo.setMaxDiscountAmount(BigDecimal.valueOf(500.00));
        testPromo.setActive(true);
        testPromo.setUsageLimit(100);
        testPromo.setUsageCount(5);
        testPromo.setStartDate(LocalDateTime.now().minusDays(1));
        testPromo.setEndDate(LocalDateTime.now().plusDays(7));
    }

    @Test
    @DisplayName("getAllPromotions returns mapped responses sorted by createdAt")
    void testGetAllPromotions() {
        when(promotionRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(testPromo));

        List<PromotionResponse> responses = promotionService.getAllPromotions();

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getCode()).isEqualTo("WELCOME10");
        assertThat(responses.get(0).getTitle()).isEqualTo("Welcome Discount");
    }

    @Test
    @DisplayName("getPromotionById returns promo when exists")
    void testGetPromotionByIdSuccess() {
        when(promotionRepository.findById(1L)).thenReturn(Optional.of(testPromo));

        PromotionResponse response = promotionService.getPromotionById(1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitle()).isEqualTo("Welcome Discount");
    }

    @Test
    @DisplayName("getPromotionById throws PromotionNotFoundException when not found")
    void testGetPromotionByIdNotFound() {
        when(promotionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> promotionService.getPromotionById(99L))
                .isInstanceOf(PromotionNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    @DisplayName("createPromotion saves and returns promotion")
    void testCreatePromotionSuccess() {
        PromotionRequest request = new PromotionRequest();
        request.setTitle("Summer Sale");
        request.setCode("SUMMER20");
        request.setDiscountType(DiscountType.PERCENTAGE);
        request.setDiscountValue(BigDecimal.valueOf(20.00));
        request.setActive(true);

        when(promotionRepository.existsByCodeIgnoreCase("SUMMER20")).thenReturn(false);
        when(promotionRepository.save(any(Promotion.class))).thenAnswer(invocation -> {
            Promotion p = invocation.getArgument(0);
            p.setId(2L);
            return p;
        });

        PromotionResponse response = promotionService.createPromotion(request);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(2L);
        assertThat(response.getTitle()).isEqualTo("Summer Sale");
        verify(promotionRepository).save(any(Promotion.class));
    }

    @Test
    @DisplayName("createPromotion throws error on duplicate code")
    void testCreatePromotionDuplicateCode() {
        PromotionRequest request = new PromotionRequest();
        request.setTitle("Duplicate");
        request.setCode("WELCOME10");
        request.setDiscountType(DiscountType.FIXED_AMOUNT);
        request.setDiscountValue(BigDecimal.valueOf(100.00));

        when(promotionRepository.existsByCodeIgnoreCase("WELCOME10")).thenReturn(true);

        assertThatThrownBy(() -> promotionService.createPromotion(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already in use");
    }

    @Test
    @DisplayName("createPromotion throws error if percentage discount > 100")
    void testCreatePromotionInvalidPercentage() {
        PromotionRequest request = new PromotionRequest();
        request.setTitle("Over 100%");
        request.setDiscountType(DiscountType.PERCENTAGE);
        request.setDiscountValue(BigDecimal.valueOf(150.00));

        assertThatThrownBy(() -> promotionService.createPromotion(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("cannot exceed 100%");
    }

    @Test
    @DisplayName("createPromotion throws error if startDate is after endDate")
    void testCreatePromotionInvalidDateRange() {
        PromotionRequest request = new PromotionRequest();
        request.setTitle("Date Error");
        request.setDiscountType(DiscountType.FIXED_AMOUNT);
        request.setDiscountValue(BigDecimal.valueOf(50.00));
        request.setStartDate(LocalDateTime.now().plusDays(5));
        request.setEndDate(LocalDateTime.now().plusDays(1));

        assertThatThrownBy(() -> promotionService.createPromotion(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Start date cannot be after end date");
    }

    @Test
    @DisplayName("updatePromotion updates existing promotion")
    void testUpdatePromotionSuccess() {
        PromotionRequest request = new PromotionRequest();
        request.setTitle("Updated Title");
        request.setCode("UPDATED10");
        request.setDiscountType(DiscountType.PERCENTAGE);
        request.setDiscountValue(BigDecimal.valueOf(15.00));
        request.setActive(false);

        when(promotionRepository.findById(1L)).thenReturn(Optional.of(testPromo));
        when(promotionRepository.existsByCodeIgnoreCaseAndIdNot("UPDATED10", 1L)).thenReturn(false);
        when(promotionRepository.save(any(Promotion.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PromotionResponse response = promotionService.updatePromotion(1L, request);

        assertThat(response.getTitle()).isEqualTo("Updated Title");
        assertThat(response.isActive()).isFalse();
    }

    @Test
    @DisplayName("setActive toggles active state")
    void testSetActive() {
        when(promotionRepository.findById(1L)).thenReturn(Optional.of(testPromo));
        when(promotionRepository.save(any(Promotion.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PromotionResponse response = promotionService.setActive(1L, false);

        assertThat(response.isActive()).isFalse();
        verify(promotionRepository).save(testPromo);
    }

    @Test
    @DisplayName("deletePromotion removes promotion when found")
    void testDeletePromotionSuccess() {
        when(promotionRepository.existsById(1L)).thenReturn(true);

        promotionService.deletePromotion(1L);

        verify(promotionRepository).deleteById(1L);
    }

    @Test
    @DisplayName("deletePromotion throws error when id does not exist")
    void testDeletePromotionNotFound() {
        when(promotionRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> promotionService.deletePromotion(99L))
                .isInstanceOf(PromotionNotFoundException.class);
    }

    @Test
    @DisplayName("validatePromotionCode correctly calculates percentage discount with cap")
    void testValidatePromotionCodePercentageWithCap() {
        when(promotionRepository.findByCodeIgnoreCase("WELCOME10")).thenReturn(Optional.of(testPromo));

        // Subtotal = 10,000 -> 10% is 1,000, capped at max 500
        PromotionValidationResponse resp = promotionService.validatePromotionCode("welcome10", BigDecimal.valueOf(10000.00));

        assertThat(resp.isValid()).isTrue();
        assertThat(resp.getDiscountAmount()).isEqualByComparingTo(BigDecimal.valueOf(500.00));
        assertThat(resp.getFinalAmount()).isEqualByComparingTo(BigDecimal.valueOf(9500.00));
    }

    @Test
    @DisplayName("validatePromotionCode correctly calculates fixed discount")
    void testValidatePromotionCodeFixedDiscount() {
        Promotion fixedPromo = new Promotion();
        fixedPromo.setCode("FIXED500");
        fixedPromo.setTitle("Flat Rs. 500 Off");
        fixedPromo.setDiscountType(DiscountType.FIXED_AMOUNT);
        fixedPromo.setDiscountValue(BigDecimal.valueOf(500.00));
        fixedPromo.setMinOrderAmount(BigDecimal.valueOf(1500.00));
        fixedPromo.setActive(true);

        when(promotionRepository.findByCodeIgnoreCase("FIXED500")).thenReturn(Optional.of(fixedPromo));

        PromotionValidationResponse resp = promotionService.validatePromotionCode("FIXED500", BigDecimal.valueOf(2000.00));

        assertThat(resp.isValid()).isTrue();
        assertThat(resp.getDiscountAmount()).isEqualByComparingTo(BigDecimal.valueOf(500.00));
        assertThat(resp.getFinalAmount()).isEqualByComparingTo(BigDecimal.valueOf(1500.00));
    }

    @Test
    @DisplayName("validatePromotionCode rejects when order amount is below minimum spend")
    void testValidatePromotionCodeBelowMinimum() {
        when(promotionRepository.findByCodeIgnoreCase("WELCOME10")).thenReturn(Optional.of(testPromo));

        // Minimum is 1000, order is 800
        PromotionValidationResponse resp = promotionService.validatePromotionCode("WELCOME10", BigDecimal.valueOf(800.00));

        assertThat(resp.isValid()).isFalse();
        assertThat(resp.getMessage()).contains("Minimum order subtotal");
    }

    @Test
    @DisplayName("validatePromotionCode rejects inactive promotion")
    void testValidatePromotionCodeInactive() {
        testPromo.setActive(false);
        when(promotionRepository.findByCodeIgnoreCase("WELCOME10")).thenReturn(Optional.of(testPromo));

        PromotionValidationResponse resp = promotionService.validatePromotionCode("WELCOME10", BigDecimal.valueOf(2000.00));

        assertThat(resp.isValid()).isFalse();
        assertThat(resp.getMessage()).contains("inactive");
    }

    @Test
    @DisplayName("validatePromotionCode rejects expired promotion")
    void testValidatePromotionCodeExpired() {
        testPromo.setEndDate(LocalDateTime.now().minusDays(1));
        when(promotionRepository.findByCodeIgnoreCase("WELCOME10")).thenReturn(Optional.of(testPromo));

        PromotionValidationResponse resp = promotionService.validatePromotionCode("WELCOME10", BigDecimal.valueOf(2000.00));

        assertThat(resp.isValid()).isFalse();
        assertThat(resp.getMessage()).contains("expired");
    }

    @Test
    @DisplayName("validatePromotionCode rejects when usage limit is reached")
    void testValidatePromotionCodeUsageLimitReached() {
        testPromo.setUsageLimit(5);
        testPromo.setUsageCount(5);
        when(promotionRepository.findByCodeIgnoreCase("WELCOME10")).thenReturn(Optional.of(testPromo));

        PromotionValidationResponse resp = promotionService.validatePromotionCode("WELCOME10", BigDecimal.valueOf(2000.00));

        assertThat(resp.isValid()).isFalse();
        assertThat(resp.getMessage()).contains("maximum usage limit");
    }

    @Test
    @DisplayName("incrementUsage increments usageCount and saves")
    void testIncrementUsage() {
        when(promotionRepository.findByCodeIgnoreCase("WELCOME10")).thenReturn(Optional.of(testPromo));

        promotionService.incrementUsage("WELCOME10");

        assertThat(testPromo.getUsageCount()).isEqualTo(6);
        verify(promotionRepository).save(testPromo);
    }
}
