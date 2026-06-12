package com.bihar.portal.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP is: " + otp + " (valid for 5 minutes)");
        mailSender.send(message);
    }

    public void sendWelcomeEmail(String toEmail, String citizenName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Welcome to Bihar One!");
        message.setText("Dear " + citizenName + ",\n\n"
                + "Your registration is now fully complete and verified. Welcome to the Bihar One portal!\n\n"
                + "Best Regards,\n"
                + "Bihar One Team");
        mailSender.send(message);
    }
}

