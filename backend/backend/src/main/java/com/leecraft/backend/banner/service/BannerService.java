package com.leecraft.backend.banner.service;

import com.leecraft.backend.banner.dto.BannerRequest;
import com.leecraft.backend.banner.dto.BannerResponse;
import com.leecraft.backend.banner.model.Banner;
import com.leecraft.backend.banner.repository.BannerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BannerService {

    private final BannerRepository bannerRepository;

    public BannerService(BannerRepository bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    public List<BannerResponse> getActiveBanners() {
        return bannerRepository.findAllByActiveTrueOrderByDisplayOrderAscCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    public List<BannerResponse> getAllBanners() {
        return bannerRepository.findAllByOrderByDisplayOrderAscCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    public BannerResponse getBannerById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public BannerResponse createBanner(BannerRequest request) {
        Banner banner = new Banner();
        apply(banner, request);
        return toResponse(bannerRepository.save(banner));
    }

    public BannerResponse updateBanner(Long id, BannerRequest request) {
        Banner banner = findOrThrow(id);
        apply(banner, request);
        return toResponse(bannerRepository.save(banner));
    }

    public BannerResponse setActive(Long id, boolean active) {
        Banner banner = findOrThrow(id);
        banner.setActive(active);
        return toResponse(bannerRepository.save(banner));
    }

    public void deleteBanner(Long id) {
        if (!bannerRepository.existsById(id)) {
            throw new RuntimeException("Banner not found with id: " + id);
        }
        bannerRepository.deleteById(id);
    }

    private Banner findOrThrow(Long id) {
        return bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner not found with id: " + id));
    }

    private void apply(Banner banner, BannerRequest request) {
        banner.setTitle(request.getTitle());
        banner.setSubtitle(request.getSubtitle());
        banner.setImageUrl(request.getImageUrl());
        banner.setLinkUrl(request.getLinkUrl());
        banner.setDisplayOrder(request.getDisplayOrder());
        banner.setActive(request.isActive());
    }

    private BannerResponse toResponse(Banner banner) {
        return new BannerResponse(
                banner.getId(),
                banner.getTitle(),
                banner.getSubtitle(),
                banner.getImageUrl(),
                banner.getLinkUrl(),
                banner.getDisplayOrder(),
                banner.isActive(),
                banner.getCreatedAt());
    }
}
