package com.leecraft.backend.content.dto;

import java.time.LocalDateTime;

public class SiteContentEntry {

    private String key;
    private String value;
    private LocalDateTime updatedAt;

    public SiteContentEntry() {}

    public SiteContentEntry(String key, String value, LocalDateTime updatedAt) {
        this.key = key;
        this.value = value;
        this.updatedAt = updatedAt;
    }

    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
