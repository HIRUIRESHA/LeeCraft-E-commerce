package com.leecraft.backend.config;

import com.leecraft.backend.user.User;
import com.leecraft.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminUserInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.username:admin@leecraft.lk}")
    private String adminEmail;

    @Value("${admin.password:admin123}")
    private String adminPassword;

    public AdminUserInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        String email = adminEmail.contains("@") ? adminEmail.toLowerCase().trim() : "admin@leecraft.lk";

        if (!userRepository.existsByEmailIgnoreCase(email)) {
            User admin = User.builder()
                    .fullName("System Administrator")
                    .email(email)
                    .phone("0771234567")
                    .password(passwordEncoder.encode(adminPassword))
                    .role("ADMIN")
                    .active(true)
                    .emailVerified(true)
                    .build();

            userRepository.save(admin);
            System.out.println("Default admin user initialized: " + email);
        }
    }
}
