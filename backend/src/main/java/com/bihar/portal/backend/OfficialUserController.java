package com.bihar.portal.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import io.jsonwebtoken.Claims;

@RestController
@RequestMapping("/officials")
public class OfficialUserController {

    private final OfficialUserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public OfficialUserController(OfficialUserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    // Register RO/SDM/DM
    @PostMapping("/register")
    public ResponseEntity<String> registerOfficial(@RequestBody OfficialUser user) {
        if (repository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email already exists!");
        }

        user.setPosition(user.getPosition().toUpperCase()); // normalize
        user.setPassword(passwordEncoder.encode(user.getPassword())); // hash password

        OfficialUser saved = repository.save(user);
        return ResponseEntity.ok("Official registered successfully with ID: " + saved.getId());
    }

    // Login and return JWT (email + role)
    @PostMapping("/login")
    public ResponseEntity<?> loginOfficial(@RequestBody OfficialUser loginRequest) {
        var userOpt = repository.findByEmail(loginRequest.getEmail());

        if (userOpt.isPresent()) {
            var u = userOpt.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), u.getPassword())) {
                // 👇 Call generateToken with both email and role
                String token = JwtUtil.generateToken(u.getEmail(), u.getPosition());
                return ResponseEntity.ok(new LoginResponse(token, u.getPosition()));
            }
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    // Nested static DTO
    public static record LoginResponse(String token, String role) {
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            // Remove "Bearer " prefix
            String token = authHeader.replace("Bearer ", "");

            if (!JwtUtil.isTokenValid(token)) {
                return ResponseEntity.status(401).body("Invalid or expired token");
            }

            // Parse claims directly
            Claims claims = JwtUtil.parseClaims(token);
            String email = claims.getSubject(); // subject = email
            // String role = claims.get("role", String.class); // role claim

            var officerOpt = repository.findByEmail(email);
            if (officerOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Officer not found");
            }

            OfficialUser officer = officerOpt.get();

            // ✅ Return officer profile with token
            ProfileResponse profile = new ProfileResponse(
                    officer.getEmail(),
                    officer.getPosition(),
                    token);

            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid or expired token");
        }
    }

    // DTO
    public static record ProfileResponse(String email, String role, String token) {
    }

}