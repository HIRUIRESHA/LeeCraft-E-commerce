package com.leecraft.backend.content.config;

import com.leecraft.backend.content.model.SiteContent;
import com.leecraft.backend.content.repository.SiteContentRepository;
import com.leecraft.backend.content.service.SiteContentService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class SiteContentSeeder implements CommandLineRunner {

    private final SiteContentRepository siteContentRepository;

    public SiteContentSeeder(SiteContentRepository siteContentRepository) {
        this.siteContentRepository = siteContentRepository;
    }

    @Override
    public void run(String... args) {
        SiteContentService.DEFAULTS.forEach((key, defaultValue) -> {
            try {
                if (!siteContentRepository.existsByContentKey(key)) {
                    siteContentRepository.save(new SiteContent(key, defaultValue));
                }
            } catch (Exception ex) {
                // Ignore seeding failure if database schema has legacy unmapped columns
            }
        });
    }
}
