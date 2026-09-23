package com.leecraft.backend.content.controller;

import com.leecraft.backend.content.dto.SiteContentEntry;
import com.leecraft.backend.content.service.SiteContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/content")
@CrossOrigin(origins = "*")
public class SiteContentController {

    private final SiteContentService siteContentService;

    public SiteContentController(SiteContentService siteContentService) {
        this.siteContentService = siteContentService;
    }

    @GetMapping
    public ResponseEntity<Map<String, String>> getAllContent() {
        Map<String, String> content = siteContentService.getAllEntries().stream()
                .collect(Collectors.toMap(SiteContentEntry::getKey, e -> e.getValue() == null ? "" : e.getValue()));
        return ResponseEntity.ok(content);
    }
}
