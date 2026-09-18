package com.leecraft.backend.auth;

import com.leecraft.backend.auth.dto.RegisterRequest;
import com.leecraft.backend.auth.dto.VerifyEmailRequest;
import com.leecraft.backend.user.User;
import com.leecraft.backend.user.UserRepository;
import com.leecraft.backend.verification.EmailVerification;
import com.leecraft.backend.verification.EmailVerificationRepository;
import com.leecraft.backend.verification.EmailService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.leecraft.backend.security.JwtService;
import com.leecraft.backend.auth.dto.AuthResponse;
import com.leecraft.backend.auth.dto.LoginRequest;
import org.springframework.transaction.annotation.Transactional;

import com.leecraft.backend.auth.dto.ForgotPasswordRequest;
import com.leecraft.backend.passwordreset.PasswordReset;
import com.leecraft.backend.passwordreset.PasswordResetRepository;
import com.leecraft.backend.auth.dto.ResetPasswordRequest;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final EmailVerificationRepository verificationRepository;
    private final PasswordResetRepository passwordResetRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            EmailVerificationRepository verificationRepository,
            PasswordResetRepository passwordResetRepository,
            EmailService emailService,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.verificationRepository = verificationRepository;
        this.passwordResetRepository = passwordResetRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String register(RegisterRequest request) {

        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException(
                    "An account with this email already exists."
            );
        }

        User user = User.builder()
                .fullName(request.fullName().trim())
                .email(email)
                .phone(request.phone().trim())
                .password(passwordEncoder.encode(request.password()))
                .emailVerified(false)
                .active(true)
                .build();

        userRepository.save(user);

        String code = generateVerificationCode();

        EmailVerification verification = EmailVerification.builder()
                .user(user)
                .code(code)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .build();

        verificationRepository.save(verification);

        emailService.sendVerificationCode(user.getEmail(), code);

        return "Registration successful. Please check your email for the verification code.";
    }

    @Transactional
    public String forgotPassword(ForgotPasswordRequest request) {

        String email = request.email().trim().toLowerCase();

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No account found with this email address."
                        )
                );

        String code = generateVerificationCode();

        PasswordReset passwordReset =
                passwordResetRepository.findByUser(user)
                        .orElseGet(() ->
                                PasswordReset.builder()
                                        .user(user)
                                        .build()
                        );

        passwordReset.setCode(code);
        passwordReset.setExpiresAt(
                LocalDateTime.now().plusMinutes(10)
        );

        passwordResetRepository.save(passwordReset);

        emailService.sendPasswordResetCode(
                user.getEmail(),
                code
        );

        return "Password reset code has been sent to your email.";
    }

    public String verifyEmail(VerifyEmailRequest request) {

        String email = request.email().trim().toLowerCase();

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found.")
                );

        if (user.isEmailVerified()) {
            return "Email is already verified.";
        }

        EmailVerification verification =
                verificationRepository.findByUser(user)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Verification code not found."
                                )
                        );

        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {

            verificationRepository.deleteByUser(user);

            throw new IllegalArgumentException(
                    "Verification code has expired."
            );
        }

        if (!verification.getCode().equals(request.code())) {
            throw new IllegalArgumentException(
                    "Invalid verification code."
            );
        }

        user.setEmailVerified(true);
        userRepository.save(user);

        verificationRepository.deleteByUser(user);

        return "Email verified successfully.";
    }

    public AuthResponse login(LoginRequest request) {

        String email = request.email().trim().toLowerCase();

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid email or password.")
                );

        if (!user.isActive()) {
            throw new IllegalArgumentException("Your account is inactive.");
        }

        if (!passwordEncoder.matches(
                request.password(),
                user.getPassword()
        )) {
            throw new IllegalArgumentException(
                    "Invalid email or password."
            );
        }

        if (!user.isEmailVerified()) {
            throw new IllegalArgumentException(
                    "Please verify your email before logging in."
            );
        }

        String token = jwtService.generateToken(
                user.getId(),
                user.getEmail()
        );

        return new AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail()
        );
    }

    @Transactional
    public String resetPassword(ResetPasswordRequest request) {

        String email = request.email().trim().toLowerCase();

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No account found with this email address."
                        )
                );

        PasswordReset passwordReset =
                passwordResetRepository.findByUser(user)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Reset code not found. Please request a new code."
                                )
                        );

        // Check whether the code has expired
        if (passwordReset.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            passwordResetRepository.delete(passwordReset);

            throw new IllegalArgumentException(
                    "Reset code has expired. Please request a new code."
            );
        }

        // Check whether the code is correct
        if (!passwordReset.getCode()
                .equals(request.code())) {

            throw new IllegalArgumentException(
                    "Invalid reset code."
            );
        }

        // Update password
        user.setPassword(
                passwordEncoder.encode(
                        request.newPassword()
                )
        );

        userRepository.save(user);

        // Delete the used reset code
        passwordResetRepository.delete(passwordReset);

        return "Password reset successfully.";
    }

    private String generateVerificationCode() {

        Random random = new Random();

        return String.format(
                "%06d",
                random.nextInt(1_000_000)
        );
    }
}