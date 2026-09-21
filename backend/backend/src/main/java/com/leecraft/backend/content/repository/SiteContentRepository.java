package com.leecraft.backend.content.repository;

import com.leecraft.backend.content.model.SiteContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SiteContentRepository extends JpaRepository<SiteContent, Long> {
    Optional<SiteContent> findByContentKey(String contentKey);
    boolean existsByContentKey(String contentKey);
}
