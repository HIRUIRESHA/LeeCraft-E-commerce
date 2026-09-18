package com.leecraft.backend.verification;

import com.leecraft.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationRepository
        extends JpaRepository<EmailVerification, Long> {

    Optional<EmailVerification> findByUser(User user);

    void deleteByUser(User user);
}