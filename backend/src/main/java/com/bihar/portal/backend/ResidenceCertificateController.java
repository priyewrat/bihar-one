package com.bihar.portal.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/residence")
public class ResidenceCertificateController {

    private final ResidenceCertificateRepository repository;

    public ResidenceCertificateController(ResidenceCertificateRepository repository) {
        this.repository = repository;
    }

    // --- Application Submission ---
    @PostMapping("/apply")
    public ResponseEntity<?> apply(
            @RequestParam("applicantName") String applicantName,
            @RequestParam("fatherName") String fatherName,
            @RequestParam("motherName") String motherName,
            @RequestParam("gender") String gender,
            @RequestParam("aadharNumber") String aadharNumber,
            @RequestParam("email") String email,
            @RequestParam("mobileNumber") String mobileNumber,
            @RequestParam("state") String state,
            @RequestParam("district") String district,
            @RequestParam("block") String block,
            @RequestParam("subDivision") String subDivision,
            @RequestParam("villageOrTown") String villageOrTown,
            @RequestParam("postOffice") String postOffice,
            @RequestParam("policeStation") String policeStation,
            @RequestParam("pinCode") String pinCode,
            @RequestParam("verificationLevel") String verificationLevel,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @RequestParam(value = "proof", required = false) MultipartFile proof) throws IOException {

        // Duplicate checks
        if (repository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("Error: Email already exists!");
        }
        if (repository.existsByAadharNumber(aadharNumber)) {
            return ResponseEntity.badRequest().body("Error: Aadhaar number already exists!");
        }

        // File size validation BEFORE reading bytes
        if (photo != null && photo.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("Photo size must be less than 5MB");
        }
        if (proof != null && proof.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("Proof size must be less than 5MB");
        }

        ResidenceCertificate certificate = new ResidenceCertificate();
        certificate.setApplicantName(applicantName);
        certificate.setFatherName(fatherName);
        certificate.setMotherName(motherName);
        certificate.setGender(gender);
        certificate.setAadharNumber(aadharNumber);
        certificate.setEmail(email);
        certificate.setMobileNumber(mobileNumber);
        certificate.setState(state);
        certificate.setDistrict(district);
        certificate.setBlock(block);
        certificate.setSubDivision(subDivision);
        certificate.setVillageOrTown(villageOrTown);
        certificate.setPostOffice(postOffice);
        certificate.setPoliceStation(policeStation);
        certificate.setPinCode(pinCode);
        certificate.setVerificationLevel(verificationLevel);

        // Generate unique application number
        certificate.setApplicationNumber("RES-" + System.currentTimeMillis());

        // Initial status
        certificate.setStatus("ASSIGNED_TO_BO");
        certificate.setAppliedDate(LocalDateTime.now());

        // Save uploaded files if provided
        if (photo != null && !photo.isEmpty()) {
            certificate.setPhoto(photo.getBytes());
        }
        if (proof != null && !proof.isEmpty()) {
            certificate.setProof(proof.getBytes());
        }

        ResidenceCertificate saved = repository.save(certificate);
        return ResponseEntity.ok(
                "Application submitted successfully. Your Application Number is: " + saved.getApplicationNumber());
    }

    // --- Get All Applications ---
    @GetMapping
    public ResponseEntity<List<ResidenceCertificate>> getAll() {
        return ResponseEntity.ok(repository.findAll());
    }

    // --- Status Check ---
    @GetMapping("/status/{applicationNumber}")
    public ResponseEntity<?> getStatus(@PathVariable String applicationNumber) {
        return repository.findByApplicationNumber(applicationNumber)
                .map(c -> ResponseEntity.ok("Application Status: " + c.getStatus()))
                .orElse(ResponseEntity.status(404).body("Application not found"));
    }

    // --- View Application ---
    @GetMapping("/{applicationNumber}")
    public ResponseEntity<?> viewApplication(@PathVariable String applicationNumber) {
        Optional<ResidenceCertificate> certOpt = repository.findByApplicationNumber(applicationNumber);
        return certOpt.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body("Application not found"));
    }

    @PostMapping("/verify/bo/{applicationNumber}")
    public ResponseEntity<?> verifyByBO(@PathVariable String applicationNumber,
            @RequestParam("remark") String remark) {
        if (!hasRole("BO")) {
            return ResponseEntity.status(403).body("Access denied: Only BO can verify here");
        }
        ResidenceCertificate cert = repository.findByApplicationNumber(applicationNumber)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!"ASSIGNED_TO_BO".equals(cert.getStatus())) {
            return ResponseEntity.badRequest().body("Application must be assigned to BO first");
        }

        cert.setBoRemark(remark);
        cert.setBoVerifiedDate(java.time.LocalDate.now().toString());
        cert.setStatus("VERIFIED_BY_BO");
        repository.save(cert);
        return ResponseEntity.ok("Application verified by BO with remark: " + remark);
    }

    @PostMapping("/verify/fo/{applicationNumber}")
    public ResponseEntity<?> verifyByFO(@PathVariable String applicationNumber,
            @RequestParam("remark") String remark) {
        if (!hasRole("FO")) {
            return ResponseEntity.status(403).body("Access denied: Only FO can verify here");
        }
        ResidenceCertificate cert = repository.findByApplicationNumber(applicationNumber)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!"VERIFIED_BY_BO".equals(cert.getStatus())) {
            return ResponseEntity.badRequest().body("Application must be verified by BO first");
        }

        cert.setFoRemark(remark);
        cert.setFoVerifiedDate(java.time.LocalDate.now().toString());
        cert.setStatus("VERIFIED_BY_FO");
        repository.save(cert);
        return ResponseEntity.ok("Application verified by FO with remark: " + remark);
    }

    // --- Approvals ---
    @PostMapping("/approve/ro/{applicationNumber}")
    public ResponseEntity<?> approveByRO(@PathVariable String applicationNumber) {
        if (!hasRole("RO")) {
            return ResponseEntity.status(403).body("Access denied: Only RO can approve here");
        }

        ResidenceCertificate cert = repository.findByApplicationNumber(applicationNumber)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!"VERIFIED_BY_FO".equals(cert.getStatus())) {
            return ResponseEntity.badRequest().body("Must be verified by FO first");
        }
        switch (cert.getVerificationLevel().toUpperCase()) {
            case "BLOCK":
            case "DISTRICT":
                cert.setStatus("CERTIFICATE_ISSUED");
                cert.setCertificateNumber("CERT-" + System.currentTimeMillis());
                cert.setCertificateIssuedDate(LocalDateTime.now());
                cert.setRoApprovedDate(java.time.LocalDate.now().toString());
                break;
            case "SUB_DIVISION":
                cert.setStatus("APPROVED_BY_RO"); // SDM will issue
                break;
            default:
                return ResponseEntity.badRequest().body("Invalid verification level");
        }
        repository.save(cert);
        return ResponseEntity.ok(cert);
    }

    @PostMapping("/approve/sdm/{applicationNumber}")
    public ResponseEntity<?> approveBySDM(@PathVariable String applicationNumber) {
        if (!hasRole("SDM")) {
            return ResponseEntity.status(403).body("Access denied: Only SDM can approve here");
        }

        ResidenceCertificate cert = repository.findByApplicationNumber(applicationNumber)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!"APPROVED_BY_RO".equals(cert.getStatus())) {
            return ResponseEntity.badRequest().body("Must be approved by RO first");
        }

        if ("SUB_DIVISION".equalsIgnoreCase(cert.getVerificationLevel())) {
            cert.setStatus("CERTIFICATE_ISSUED");
            cert.setCertificateIssuedDate(LocalDateTime.now());
            cert.setCertificateNumber("CERT-" + System.currentTimeMillis());
            cert.setSdmApprovedDate(java.time.LocalDate.now().toString());
        } else {
            return ResponseEntity.badRequest().body("SDM approval not required for this level");
        }
        repository.save(cert);
        return ResponseEntity.ok(cert);
    }

    @PostMapping("/approve/dm/{applicationNumber}")
    public ResponseEntity<?> approveByDM(@PathVariable String applicationNumber) {
        if (!hasRole("DM")) {
            return ResponseEntity.status(403).body("Access denied: Only DM can approve here");
        }

        ResidenceCertificate cert = repository.findByApplicationNumber(applicationNumber)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!"APPROVED_BY_RO".equals(cert.getStatus())) {
            return ResponseEntity.badRequest().body("Must be approved by RO first");
        }

        if ("DISTRICT".equalsIgnoreCase(cert.getVerificationLevel())) {
            cert.setStatus("CERTIFICATE_ISSUED");
            cert.setCertificateNumber("CERT-" + System.currentTimeMillis());
            cert.setDmApprovedDate(java.time.LocalDate.now().toString());
            cert.setCertificateIssuedDate(LocalDateTime.now());
        } else {
            return ResponseEntity.badRequest().body("DM approval not required for this level");
        }

        repository.save(cert);
        return ResponseEntity.ok(cert);
    }

    // --- Rejections ---
    @PostMapping("/reject/ro/{applicationNumber}")
    public ResponseEntity<?> rejectByRO(@PathVariable String applicationNumber,
            @RequestParam("remark") String remark) {
        if (!hasRole("RO")) {
            return ResponseEntity.status(403).body("Access denied: Only RO can reject here");
        }

        ResidenceCertificate cert = repository.findByApplicationNumber(applicationNumber)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        cert.setRoRemark(remark);
        cert.setStatus("REJECTED_BY_RO");
        repository.save(cert);
        return ResponseEntity.ok("Application rejected by RO with remark: " + remark);
    }

    @PostMapping("/reject/sdm/{applicationNumber}")
    public ResponseEntity<?> rejectBySDM(@PathVariable String applicationNumber,
            @RequestParam("remark") String remark) {
        if (!hasRole("SDM")) {
            return ResponseEntity.status(403).body("Access denied: Only SDM can reject here");
        }

        ResidenceCertificate cert = repository.findByApplicationNumber(applicationNumber)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        if (!"APPROVED_BY_RO".equals(cert.getStatus())) {
            return ResponseEntity.badRequest().body("Must be approved by RO first");
        }
        cert.setSdmRemark(remark);
        cert.setStatus("REJECTED_BY_SDM");
        repository.save(cert);
        return ResponseEntity.ok("Application rejected by SDM with remark: " + remark);
    }

    @PostMapping("/reject/dm/{applicationNumber}")
    public ResponseEntity<?> rejectByDM(@PathVariable String applicationNumber,
            @RequestParam("remark") String remark) {
        if (!hasRole("DM")) {
            return ResponseEntity.status(403).body("Access denied: Only DM can reject here");
        }

        ResidenceCertificate cert = repository.findByApplicationNumber(applicationNumber)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        cert.setDmRemark(remark);
        cert.setStatus("REJECTED_BY_DM");
        repository.save(cert);
        return ResponseEntity.ok("Application rejected by DM with remark: " + remark);
    }

    // --- Utility method for role check ---
    private boolean hasRole(String role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + role));
    }

    @GetMapping("/certificate/{applicationNumber}")
    public ResponseEntity<?> getCertificateData(@PathVariable String applicationNumber) {
        Optional<ResidenceCertificate> certOpt = repository.findByApplicationNumber(applicationNumber);

        if (certOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Application not found");
        }

        ResidenceCertificate cert = certOpt.get();

        if (!"CERTIFICATE_ISSUED".equals(cert.getStatus())) {
            return ResponseEntity.badRequest().body("Certificate not yet issued");
        }

        // Return the certificate object (JSON) so frontend can generate PDF
        return ResponseEntity.ok(cert);
    }

    @GetMapping("/verify/{certificateNumber}")
    public ResponseEntity<Map<String, String>> verifyCertificate(@PathVariable String certificateNumber) {
        return repository.findByCertificateNumber(certificateNumber)
                .map(cert -> ResponseEntity.ok(
                        Map.of(
                                "certificateNumber", cert.getCertificateNumber(),
                                "applicantName", cert.getApplicantName(),
                                "fatherName", cert.getFatherName(),
                                "gender", cert.getGender(),
                                "verificationLevel", cert.getVerificationLevel())))
                .orElseGet(() -> ResponseEntity.status(404).body(
                        Map.of("error", "Certificate not found")));
    }

}
