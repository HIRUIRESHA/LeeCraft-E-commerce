package com.leecraft.backend.content.service;

import com.leecraft.backend.content.dto.SiteContentEntry;
import com.leecraft.backend.content.model.SiteContent;
import com.leecraft.backend.content.repository.SiteContentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class SiteContentService {

    /** Default keys seeded on startup so the admin content screen always has something to edit. */
    public static final Map<String, String> DEFAULTS = Map.ofEntries(
            Map.entry("ABOUT_HEADING", "Naturally Crafted"),
            Map.entry("ABOUT_BODY", "LeeCraft.lk began with a simple idea: kitchen tools should last a lifetime, not a season. Every board starts as reclaimed and responsibly sourced timber from across Sri Lanka — teak, mahogany, rosewood — before it passes through the hands of local artisans who shape, sand and oil each piece by hand."),
            Map.entry("CONTACT_EMAIL", "hello@leecraft.lk"),
            Map.entry("CONTACT_PHONE", "+94 77 123 4567"),
            Map.entry("CONTACT_ADDRESS", "Colombo, Sri Lanka"),
            Map.entry("HOME_FEATURED_HEADING", "Featured Cutting Boards"),
            Map.entry("HOME_FEATURED_SUBHEADING", "Best Sellers")
    );

    private final SiteContentRepository siteContentRepository;

    public SiteContentService(SiteContentRepository siteContentRepository) {
        this.siteContentRepository = siteContentRepository;
    }

    public List<SiteContentEntry> getAllEntries() {
        return siteContentRepository.findAll().stream()
                .map(this::toEntry)
                .sorted((a, b) -> a.getKey().compareTo(b.getKey()))
                .toList();
    }

    public SiteContentEntry getByKey(String key) {
        SiteContent content = siteContentRepository.findByContentKey(key)
                .orElseThrow(() -> new RuntimeException("Site content not found for key: " + key));
        return toEntry(content);
    }

    public SiteContentEntry updateByKey(String key, String value) {
        SiteContent content = siteContentRepository.findByContentKey(key)
                .orElseGet(() -> new SiteContent(key, null));
        content.setContentValue(value);
        return toEntry(siteContentRepository.save(content));
    }

    private SiteContentEntry toEntry(SiteContent content) {
        return new SiteContentEntry(content.getContentKey(), content.getContentValue(), content.getUpdatedAt());
    }
}
