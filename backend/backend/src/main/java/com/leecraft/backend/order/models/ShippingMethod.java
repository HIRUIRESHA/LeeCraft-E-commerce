package com.leecraft.backend.order.models;

import java.math.BigDecimal;

public enum ShippingMethod {
    STANDARD(new BigDecimal("400")),
    EXPRESS(new BigDecimal("850"));

    private final BigDecimal cost;

    ShippingMethod(BigDecimal cost) {
        this.cost = cost;
    }

    public BigDecimal cost() {
        return cost;
    }
}
