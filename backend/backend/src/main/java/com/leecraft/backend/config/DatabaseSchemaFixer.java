package com.leecraft.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Automatically patches legacy database column constraints that were left behind
 * during entity refactoring without migration scripts.
 */
@Component
@Order(0)
public class DatabaseSchemaFixer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSchemaFixer.class);
    private final JdbcTemplate jdbcTemplate;

    public DatabaseSchemaFixer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        // Fix legacy NOT NULL constraint on promotions.discount_percent
        try {
            jdbcTemplate.execute("ALTER TABLE promotions ALTER COLUMN discount_percent DROP NOT NULL");
            log.info("Database schema patch: Dropped NOT NULL constraint on promotions.discount_percent");
        } catch (Exception e) {
            log.debug("Notice on promotions.discount_percent schema patch: {}", e.getMessage());
        }

        // Fix legacy NOT NULL constraints on site_content table
        String[] legacySiteContentCols = {"body", "section_key", "title", "content"};
        for (String col : legacySiteContentCols) {
            try {
                jdbcTemplate.execute("ALTER TABLE site_content ALTER COLUMN " + col + " DROP NOT NULL");
                log.info("Database schema patch: Dropped NOT NULL constraint on site_content.{}", col);
            } catch (Exception ignored) {
            }
        }
    }
}
