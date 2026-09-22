package com.leecraft.backend.promotion;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.leecraft.backend.promotion.controller.AdminPromotionController;
import com.leecraft.backend.promotion.dto.PromotionRequest;
import com.leecraft.backend.promotion.dto.PromotionResponse;
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
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AdminPromotionControllerTest {

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @Mock
    private PromotionService promotionService;

    @InjectMocks
    private AdminPromotionController adminPromotionController;

    private PromotionResponse testResponse;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(adminPromotionController).build();
        objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules();

        testResponse = new PromotionResponse();
        testResponse.setId(1L);
        testResponse.setTitle("Spring Sale");
        testResponse.setCode("SPRING15");
        testResponse.setDiscountType(DiscountType.PERCENTAGE);
        testResponse.setDiscountValue(BigDecimal.valueOf(15.00));
        testResponse.setActive(true);
    }

    @Test
    @DisplayName("GET /api/admin/promotions returns list of promotions")
    void testGetAllPromotions() throws Exception {
        when(promotionService.getAllPromotions()).thenReturn(List.of(testResponse));

        mockMvc.perform(get("/api/admin/promotions"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title").value("Spring Sale"))
                .andExpect(jsonPath("$[0].code").value("SPRING15"));

        verify(promotionService).getAllPromotions();
    }

    @Test
    @DisplayName("GET /api/admin/promotions/{id} returns promotion by id")
    void testGetPromotionById() throws Exception {
        when(promotionService.getPromotionById(1L)).thenReturn(testResponse);

        mockMvc.perform(get("/api/admin/promotions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Spring Sale"));

        verify(promotionService).getPromotionById(1L);
    }

    @Test
    @DisplayName("POST /api/admin/promotions creates a new promotion")
    void testCreatePromotion() throws Exception {
        PromotionRequest request = new PromotionRequest();
        request.setTitle("Spring Sale");
        request.setCode("SPRING15");
        request.setDiscountType(DiscountType.PERCENTAGE);
        request.setDiscountValue(BigDecimal.valueOf(15.00));
        request.setActive(true);

        when(promotionService.createPromotion(any(PromotionRequest.class))).thenReturn(testResponse);

        mockMvc.perform(post("/api/admin/promotions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Spring Sale"));

        verify(promotionService).createPromotion(any(PromotionRequest.class));
    }

    @Test
    @DisplayName("PUT /api/admin/promotions/{id} updates promotion")
    void testUpdatePromotion() throws Exception {
        PromotionRequest request = new PromotionRequest();
        request.setTitle("Spring Sale Updated");
        request.setCode("SPRING15");
        request.setDiscountType(DiscountType.PERCENTAGE);
        request.setDiscountValue(BigDecimal.valueOf(15.00));
        request.setActive(true);

        when(promotionService.updatePromotion(eq(1L), any(PromotionRequest.class))).thenReturn(testResponse);

        mockMvc.perform(put("/api/admin/promotions/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(promotionService).updatePromotion(eq(1L), any(PromotionRequest.class));
    }

    @Test
    @DisplayName("PATCH /api/admin/promotions/{id}/active sets promotion status")
    void testSetActive() throws Exception {
        testResponse.setActive(false);
        when(promotionService.setActive(1L, false)).thenReturn(testResponse);

        mockMvc.perform(patch("/api/admin/promotions/1/active")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("active", false))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(false));

        verify(promotionService).setActive(1L, false);
    }

    @Test
    @DisplayName("DELETE /api/admin/promotions/{id} deletes promotion and returns 204")
    void testDeletePromotion() throws Exception {
        doNothing().when(promotionService).deletePromotion(1L);

        mockMvc.perform(delete("/api/admin/promotions/1"))
                .andExpect(status().isNoContent());

        verify(promotionService).deletePromotion(1L);
    }
}
