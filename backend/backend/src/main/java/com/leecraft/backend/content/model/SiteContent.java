package com.leecraft.backend.content.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "site_content")
public class SiteContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "content_key", nullable = false, unique = true, length = 100)
    private String contentKey;

    @Column(name = "content_value", length = 4000)
    private String contentValue;

    @Column(name = "body", length = 4000)
    private String body;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.updatedAt = LocalDateTime.now();
        if (this.body == null && this.contentValue != null) {
            this.body = this.contentValue;
        }
    }

    public SiteContent() {}

    public SiteContent(String contentKey, String contentValue) {
        this.contentKey = contentKey;
        this.contentValue = contentValue;
        this.body = contentValue;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContentKey() { return contentKey; }
    public void setContentKey(String contentKey) { this.contentKey = contentKey; }
    public String getContentValue() { return contentValue; }
    public void setContentValue(String contentValue) {
        this.contentValue = contentValue;
        if (this.body == null) {
            this.body = contentValue;
        }
    }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
