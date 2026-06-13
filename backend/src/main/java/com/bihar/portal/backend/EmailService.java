package com.bihar.portal.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${brevo.api.key}")
    private String apiKey;

    public void sendOtpEmail(String to, String otp) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);

        Map<String, Object> requestBody = Map.of(
                "sender", Map.of(
                        "name", "Bihar One",
                        "email", "digitalm4044@gmail.com"
                ),
                "to", List.of(
                        Map.of("email", to)
                ),
                "subject", "Your OTP Code",
                "htmlContent",
                "<h2>Your OTP is: " + otp + "</h2><p>Valid for 5 minutes.</p>"
        );

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response =
                restTemplate.postForEntity(
                        "https://api.brevo.com/v3/smtp/email",
                        entity,
                        String.class
                );

        System.out.println("Brevo Response: " + response.getBody());
    }

    public void sendWelcomeEmail(String toEmail, String citizenName) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);

        Map<String, Object> requestBody = Map.of(
                "sender", Map.of(
                        "name", "Bihar One",
                        "email", "digitalm4044@gmail.com"
                ),
                "to", List.of(
                        Map.of("email", toEmail)
                ),
                "subject", "Welcome to Bihar One!",
                "htmlContent",
                "<h2>Welcome " + citizenName + "</h2><p>Your registration is now verified.</p>"
        );

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(requestBody, headers);

        restTemplate.postForEntity(
                "https://api.brevo.com/v3/smtp/email",
                entity,
                String.class
        );
    }
}