package com.leecraft.backend.verification;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationCode(String email, String code) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("LeeCraft Email Verification");
        message.setText(
                "Your LeeCraft verification code is: " + code +
                        "\n\nThis code will expire in 5 minutes."
        );

        mailSender.send(message);
    }

    public void sendPasswordResetCode(String email, String code) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("LeeCraft.lk - Password Reset Code");

        message.setText(
                "Hello,\n\n" +
                        "We received a request to reset your LeeCraft.lk account password.\n\n" +
                        "Your password reset code is:\n\n" +
                        code + "\n\n" +
                        "This code will expire in 10 minutes.\n\n" +
                        "If you did not request a password reset, you can safely ignore this email.\n\n" +
                        "Regards,\n" +
                        "LeeCraft.lk Team"
        );

        mailSender.send(message);
    }
}