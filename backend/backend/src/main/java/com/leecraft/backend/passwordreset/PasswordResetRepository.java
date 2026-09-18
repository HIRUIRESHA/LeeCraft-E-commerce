package com.leecraft.backend.passwordreset;

import com.leecraft.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetRepository
        extends JpaRepository<PasswordReset, Long> {

    Optional<PasswordReset> findByUser(User user);

    void deleteByUser(User user);
}