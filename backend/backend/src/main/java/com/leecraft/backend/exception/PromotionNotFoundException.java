package com.leecraft.backend.exception;

public class PromotionNotFoundException extends RuntimeException {

    public PromotionNotFoundException(Long id) {
        super("Promotion not found with id: " + id);
    }

    public PromotionNotFoundException(String message) {
        super(message);
    }
}
