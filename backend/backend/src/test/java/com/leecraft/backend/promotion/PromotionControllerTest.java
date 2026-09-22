package com.leecraft.backend.promotion;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.leecraft.backend.promotion.controller.PromotionController;
import com.leecraft.backend.promotion.dto.PromotionResponse;
import com.leecraft.backend.promotion.dto.PromotionValidationRequest;
import com.leecraft.backend.promotion.dto.PromotionValidationResponse;
import com.leecraft.backend.promotion.model.DiscountType;
import com.leecraft.backend.promotion.service.PromotionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class PromotionControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @Mock
    private PromotionService promotionService;

    @InjectMocks
    private PromotionController promotionController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(promotionController).build();
        objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules();
    }

    @Test
    @DisplayName("GET /api/promotions returns active promotions")
    void testGetActivePromotions() throws Exception {
        PromotionResponse p = new PromotionResponse();
        p.setId(1L);
        p.setTitle("Public Deal");
        p.setActive(true);

        when(promotionService.getActivePromotions()).thenReturn(List.of(p));

        mockMvc.perform(get("/api/promotions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title").value("Public Deal"));

        verify(promotionService).getActivePromotions();
    }

    @Test
    @DisplayName("POST /api/promotions/validate validates promo code and returns discount calculation")
    void testValidatePromotion() throws Exception {
        PromotionValidationRequest request = new PromotionValidationRequest("LEECRAFT10", BigDecimal.valueOf(5000.00));
        PromotionValidationResponse response = PromotionValidationResponse.valid(
                "LEECRAFT10",
                "10% Off",
                DiscountType.PERCENTAGE,
                BigDecimal.valueOf(10.00),
                BigDecimal.valueOf(500.00),
                BigDecimal.valueOf(4500.00),
                "10% discount applied!"
        );

        when(promotionService.validatePromotionCode(eq("LEECRAFT10"), eq(BigDecimal.valueOf(5000.00))))
                .thenReturn(response);

        mockMvc.perform(post("/api/promotions/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(true))
                .andExpect(jsonPath("$.code").value("LEECRAFT10"))
                .andExpect(jsonPath("$.discountAmount").value(500.00))
                .andExpect(jsonPath("$.finalAmount").value(4500.00));
    }
}
