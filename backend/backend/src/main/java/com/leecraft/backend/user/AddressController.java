package com.leecraft.backend.user;

import com.leecraft.backend.user.dto.AddressRequest;
import com.leecraft.backend.user.dto.AddressResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/addresses")
public class AddressController {

    private final ProfileService profileService;

    public AddressController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getAddresses(Authentication authentication) {
        return ResponseEntity.ok(
                profileService.getAddresses(authentication.getName())
        );
    }

    @PostMapping
    public ResponseEntity<AddressResponse> addAddress(
            Authentication authentication,
            @Valid @RequestBody AddressRequest request
    ) {
        return ResponseEntity.ok(
                profileService.addAddress(authentication.getName(), request)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> updateAddress(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request
    ) {
        return ResponseEntity.ok(
                profileService.updateAddress(authentication.getName(), id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(
            Authentication authentication,
            @PathVariable Long id
    ) {
        profileService.deleteAddress(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
