package com.leecraft.backend.content.controller;

import com.leecraft.backend.content.dto.SiteContentEntry;
import com.leecraft.backend.content.dto.SiteContentUpdateRequest;
import com.leecraft.backend.content.service.SiteContentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/content")
public class AdminSiteContentController {

    private final SiteContentService siteContentService;

    public AdminSiteContentController(SiteContentService siteContentService) {
        this.siteContentService = siteContentService;
    }

    @GetMapping
    public ResponseEntity<List<SiteContentEntry>> getAllEntries() {
        return ResponseEntity.ok(siteContentService.getAllEntries());
    }

    @PutMapping("/{key}")
    public ResponseEntity<SiteContentEntry> updateEntry(@PathVariable String key, @Valid @RequestBody SiteContentUpdateRequest request) {
        return ResponseEntity.ok(siteContentService.updateByKey(key, request.getValue()));
    }
}
