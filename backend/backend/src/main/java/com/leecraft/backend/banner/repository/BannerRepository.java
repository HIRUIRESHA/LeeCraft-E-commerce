package com.leecraft.backend.banner.repository;

import com.leecraft.backend.banner.model.Banner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Long> {
    List<Banner> findAllByOrderByDisplayOrderAscCreatedAtDesc();
    List<Banner> findAllByActiveTrueOrderByDisplayOrderAscCreatedAtDesc();
}
