package com.leecraft.backend.upload.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class SupabaseStorageService {

    private final RestTemplate restTemplate;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-key}")
    private String serviceKey;

    @Value("${supabase.storage.bucket}")
    private String bucket;

    public SupabaseStorageService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String uploadImage(MultipartFile file) {
        if (serviceKey == null || serviceKey.isBlank()) {
            throw new IllegalStateException("Supabase service key is not configured. Please set SUPABASE_SERVICE_KEY in .env or environment variables.");
        }
        try {
            String fileName = UUID.randomUUID() + getExtension(file.getOriginalFilename());
            String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + fileName;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + serviceKey);
            headers.set("apikey", serviceKey);
            headers.setContentType(MediaType.parseMediaType(
                    file.getContentType() != null ? file.getContentType() : "application/octet-stream"));

            HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);
            restTemplate.exchange(uploadUrl, HttpMethod.POST, requestEntity, String.class);

            return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to read uploaded file", e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage(), e);
        }
    }

    private String getExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) return "";
        return originalFilename.substring(originalFilename.lastIndexOf('.'));
    }
}