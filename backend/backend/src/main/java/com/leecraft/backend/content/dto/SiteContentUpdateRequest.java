package com.leecraft.backend.content.dto;

import jakarta.validation.constraints.Size;

public class SiteContentUpdateRequest {

    @Size(max = 4000)
    private String value;

    public SiteContentUpdateRequest() {}

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
}
