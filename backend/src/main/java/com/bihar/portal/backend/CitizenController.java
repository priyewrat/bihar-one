package com.bihar.portal.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/citizens")
public class CitizenController {

    private final CitizenRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // Temporary OTP store (phone → OtpEntry)
    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    public CitizenController(CitizenRepository repository,
            PasswordEncoder passwordEncoder,
            EmailService emailService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Citizen citizen) {
        if (repository.existsByEmail(citizen.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email already exists!");
        }
        if (repository.existsByAadharNumber(citizen.getAadharNumber())) {
            return ResponseEntity.badRequest().body("Error: Aadhaar number already exists!");
        }
        if (repository.existsByPhoneNumber(citizen.getPhoneNumber())) {
            return ResponseEntity.badRequest().body("Error: Mobile number already exists!");
        }

        citizen.setPassword(passwordEncoder.encode(citizen.getPassword()));
        citizen.setVerified(false); // not verified until OTP
        citizen.setRole("CITIZEN");
        Citizen saved = repository.save(citizen);

        // Generate OTP and send via email
        String otp = generateOtp(6);
        long expiry = System.currentTimeMillis() + 5 * 60 * 1000; // 5 minutes
        otpStore.put(saved.getPhoneNumber(), new OtpEntry(otp, expiry));

        // Debug log for development
        System.out.println("Generated OTP for " + saved.getPhoneNumber() + ": " + otp);

        emailService.sendOtpEmail(saved.getEmail(), otp);

        return ResponseEntity.ok("Citizen registered. OTP sent to email.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String phoneNumber,
            @RequestParam String enteredOtp, @RequestParam(required = false, defaultValue = "register") String purpose) {
        OtpEntry entry = otpStore.get(phoneNumber);

        if (entry == null) {
            return ResponseEntity.status(401).body("No OTP found or expired for this phone number");
        }
        if (System.currentTimeMillis() > entry.expiryTime) {
            otpStore.remove(phoneNumber);
            return ResponseEntity.status(401).body("OTP expired");
        }
        if (!entry.otp.equals(enteredOtp)) {
            return ResponseEntity.status(401).body("Invalid OTP");
        }

        Citizen citizen = repository.findByPhoneNumber(phoneNumber).orElse(null);
        if (citizen == null) {
            return ResponseEntity.status(404).body("Citizen not found");
        }

        citizen.setVerified(true);
        citizen.setRole("CITIZEN");
        repository.save(citizen);
        otpStore.remove(phoneNumber);

        if ("register".equalsIgnoreCase(purpose)) {
            try {
                emailService.sendWelcomeEmail(citizen.getEmail(), citizen.getName());
            } catch (Exception e) {
                System.err.println("Warning: Failed to send welcome email to " + citizen.getEmail() + " - " + e.getMessage());
            }
        }

        return ResponseEntity.ok("OTP verified successfully!");
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestParam String phoneNumber) {
        Citizen citizen = repository.findByPhoneNumber(phoneNumber).orElse(null);

        if (citizen == null) {
            return ResponseEntity.status(404).body("Citizen not found");
        }
        if (citizen.isVerified()) {
            return ResponseEntity.badRequest().body("Citizen already verified");
        }

        // Generate new OTP
        String otp = generateOtp(6);
        long expiry = System.currentTimeMillis() + 5 * 60 * 1000;
        otpStore.put(phoneNumber, new OtpEntry(otp, expiry));

        // Debug log
        System.out.println("Resent OTP for " + phoneNumber + ": " + otp);

        emailService.sendOtpEmail(citizen.getEmail(), otp);

        return ResponseEntity.ok("New OTP sent to email.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Citizen loginRequest) {
        Citizen citizen = repository.findByEmail(loginRequest.getEmail()).orElse(null);

        if (citizen == null || !passwordEncoder.matches(loginRequest.getPassword(), citizen.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        if (!citizen.isVerified()) {
            return ResponseEntity.status(403).body("Account not verified. Please complete OTP verification.");
        }

        String token = JwtUtil.generateToken(citizen.getEmail(), citizen.getRole());
        return ResponseEntity.ok(new LoginResponse(token, citizen.getRole()));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            // Remove "Bearer " prefix
            String token = authHeader.replace("Bearer ", "");

            // Extract email from token
            String email = JwtUtil.extractEmail(token);

            Citizen citizen = repository.findByEmail(email).orElse(null);
            if (citizen == null) {
                return ResponseEntity.status(404).body("Citizen not found");
            }

            // Hide sensitive info
            citizen.setPassword(null);

            // ✅ Use HashMap instead of Map.of
            Map<String, Object> profile = new java.util.HashMap<>();
            profile.put("id", citizen.getId());
            profile.put("name", citizen.getName());
            profile.put("email", citizen.getEmail());
            profile.put("phoneNumber", citizen.getPhoneNumber());
            profile.put("aadharNumber", citizen.getAadharNumber());
            profile.put("fatherName", citizen.getFatherName());
            profile.put("motherName", citizen.getMotherName());
            profile.put("gender", citizen.getGender());
            profile.put("state", citizen.getState());
            profile.put("district", citizen.getDistrict());
            profile.put("subdivision", citizen.getSubdivision());
            profile.put("block", citizen.getBlock());
            profile.put("village", citizen.getVillage());
            profile.put("postOffice", citizen.getPostOffice());
            profile.put("policeStation", citizen.getPoliceStation());
            profile.put("pincode", citizen.getPincode());
            profile.put("verified", citizen.isVerified());

            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid or expired token");
        }
    }

    @GetMapping
    public ResponseEntity<List<Citizen>> getAll() {
        return ResponseEntity.ok(repository.findAll());
    }

    // Utility method for OTP generation
    private String generateOtp(int length) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append((int) (Math.random() * 10));
        }
        return sb.toString();
    }

    // Nested DTO for login response
    public static record LoginResponse(String token, String role) {
    }

    // Inner class for OTP entries
    private static class OtpEntry {
        String otp;
        long expiryTime;

        OtpEntry(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }
}
