package com.leecraft.backend.user;

import com.leecraft.backend.user.dto.AdminCustomerResponse;
import com.leecraft.backend.user.dto.CustomerStatusRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/customers")
public class AdminCustomerController {

    private final UserRepository userRepository;

    public AdminCustomerController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<AdminCustomerResponse>> getCustomers() {
        List<AdminCustomerResponse> customers = userRepository
                .findByRoleOrderByCreatedAtDesc("CUSTOMER")
                .stream()
                .map(this::mapToResponse)
                .toList();

        return ResponseEntity.ok(customers);
    }

    @PatchMapping("/{id}/status")
    @Transactional
    public ResponseEntity<AdminCustomerResponse> updateCustomerStatus(
            @PathVariable Long id,
            @RequestBody CustomerStatusRequest request
    ) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found."));

        user.setActive(request.active());
        user = userRepository.save(user);

        return ResponseEntity.ok(mapToResponse(user));
    }

    private AdminCustomerResponse mapToResponse(User user) {
        return new AdminCustomerResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.isActive(),
                user.isEmailVerified(),
                user.getCreatedAt()
        );
    }
}
