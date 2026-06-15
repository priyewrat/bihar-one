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

        // Beautifully styled HTML template for OTP Email
        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                <style>
                  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
                  .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e1e8ed; }
                  .header { background-color: #1a73e8; padding: 20px; text-align: center; color: white; }
                  .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px; }
                  .content { padding: 35px; text-align: center; color: #333333; }
                  .content p { font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #555555; }
                  .otp-code { display: inline-block; font-size: 36px; font-weight: bold; letter-spacing: 6px; color: #1a73e8; background-color: #f0f4f8; padding: 15px 35px; border-radius: 8px; margin: 15px 0 25px; border: 2px dashed #1a73e8; }
                  .footer { background-color: #f9fbfd; padding: 20px; text-align: center; font-size: 13px; color: #888888; border-top: 1px solid #eeeeee; }
                </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>Bihar One Portal</h1>
                    </div>
                    <div class="content">
                      <p>Hello,</p>
                      <p>You requested a One-Time Password (OTP) for your Bihar One account. Please use the code below to complete your verification.</p>
                      <div class="otp-code">%s</div>
                      <p>This code is valid for <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
                    </div>
                    <div class="footer">
                      <p>If you did not request this OTP, please ignore this email.</p>
                      <p>&copy; Bihar One Portal. All rights reserved.</p>
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(otp);

        Map<String, Object> requestBody = Map.of(
                "sender", Map.of(
                        "name", "Bihar One",
                        "email", "digitalm4044@gmail.com"
                ),
                "to", List.of(
                        Map.of("email", to)
                ),
                "subject", "Your Bihar One OTP Code",
                "htmlContent", htmlContent
        );

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response =
                restTemplate.postForEntity(
                        "https://api.brevo.com/v3/smtp/email",
                        entity,
                        String.class
                );

        System.out.println("Brevo OTP Response: " + response.getBody());
    }

    public void sendWelcomeEmail(String toEmail, String citizenName) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);

        // Beautifully styled HTML template for Welcome Email
        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                <style>
                  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
                  .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e1e8ed; }
                  .header { background-color: #28a745; padding: 25px; text-align: center; color: white; }
                  .header h1 { margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px; }
                  .content { padding: 35px; color: #333333; }
                  .content p { font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #444444; }
                  .content .highlight { color: #28a745; font-weight: 600; }
                  .signature { margin-top: 30px; font-size: 16px; }
                  .footer { background-color: #f9fbfd; padding: 20px; text-align: center; font-size: 13px; color: #888888; border-top: 1px solid #eeeeee; }
                </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>Welcome to Bihar One!</h1>
                    </div>
                    <div class="content">
                      <p>Dear <strong>%s</strong>,</p>
                      <p>Your registration is now fully complete and verified. Welcome to the <span class="highlight">Bihar One portal</span>!</p>
                      <p>You can now explore all the services and features available on the platform designed to serve you better.</p>
                      <div class="signature">
                        <p>Best Regards,<br><strong>Bihar One Team</strong></p>
                      </div>
                    </div>
                    <div class="footer">
                      <p>This is an automated message, please do not reply to this email.</p>
                      <p>&copy; Bihar One Portal. All rights reserved.</p>
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(citizenName);

        Map<String, Object> requestBody = Map.of(
                "sender", Map.of(
                        "name", "Bihar One",
                        "email", "digitalm4044@gmail.com"
                ),
                "to", List.of(
                        Map.of("email", toEmail)
                ),
                "subject", "Welcome to Bihar One Portal!",
                "htmlContent", htmlContent
        );

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                "https://api.brevo.com/v3/smtp/email",
                entity,
                String.class
        );
        
        System.out.println("Brevo Welcome Response: " + response.getBody());
    }
}