package com.leecraft.backend.user;

import com.leecraft.backend.user.dto.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final UserAddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(
            UserRepository userRepository,
            UserAddressRepository addressRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserProfileResponse getProfile(String email) {
        User user = getUserByEmail(email);
        return mapToProfileResponse(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = getUserByEmail(email);
        user.setFullName(request.fullName().trim());
        user.setPhone(request.phone().trim());
        user = userRepository.save(user);
        return mapToProfileResponse(user);
    }

    @Transactional
    public String changePassword(String email, ChangePasswordRequest request) {
        User user = getUserByEmail(email);

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect.");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        return "Password changed successfully.";
    }

    public List<AddressResponse> getAddresses(String email) {
        User user = getUserByEmail(email);
        return addressRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user)
                .stream()
                .map(this::mapToAddressResponse)
                .toList();
    }

    @Transactional
    public AddressResponse addAddress(String email, AddressRequest request) {
        User user = getUserByEmail(email);

        if (request.isDefault()) {
            resetDefaultAddresses(user);
        }

        UserAddress address = UserAddress.builder()
                .user(user)
                .recipientName(request.recipientName().trim())
                .phone(request.phone().trim())
                .streetAddress(request.streetAddress().trim())
                .city(request.city().trim())
                .postalCode(request.postalCode() != null ? request.postalCode().trim() : null)
                .isDefault(request.isDefault())
                .build();

        address = addressRepository.save(address);
        return mapToAddressResponse(address);
    }

    @Transactional
    public AddressResponse updateAddress(String email, Long addressId, AddressRequest request) {
        User user = getUserByEmail(email);
        UserAddress address = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new IllegalArgumentException("Address not found."));

        if (request.isDefault() && !address.isDefault()) {
            resetDefaultAddresses(user);
        }

        address.setRecipientName(request.recipientName().trim());
        address.setPhone(request.phone().trim());
        address.setStreetAddress(request.streetAddress().trim());
        address.setCity(request.city().trim());
        address.setPostalCode(request.postalCode() != null ? request.postalCode().trim() : null);
        address.setDefault(request.isDefault());

        address = addressRepository.save(address);
        return mapToAddressResponse(address);
    }

    @Transactional
    public void deleteAddress(String email, Long addressId) {
        User user = getUserByEmail(email);
        UserAddress address = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new IllegalArgumentException("Address not found."));
        addressRepository.delete(address);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }

    private void resetDefaultAddresses(User user) {
        List<UserAddress> addresses = addressRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user);
        for (UserAddress addr : addresses) {
            if (addr.isDefault()) {
                addr.setDefault(false);
                addressRepository.save(addr);
            }
        }
    }

    private UserProfileResponse mapToProfileResponse(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.isEmailVerified(),
                user.getCreatedAt()
        );
    }

    private AddressResponse mapToAddressResponse(UserAddress address) {
        return new AddressResponse(
                address.getId(),
                address.getRecipientName(),
                address.getPhone(),
                address.getStreetAddress(),
                address.getCity(),
                address.getPostalCode(),
                address.isDefault()
        );
    }
}
