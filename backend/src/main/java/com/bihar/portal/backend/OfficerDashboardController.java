package com.bihar.portal.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class OfficerDashboardController {

    private final ResidenceCertificateRepository residenceRepo;

    public OfficerDashboardController(ResidenceCertificateRepository residenceRepo) {
        this.residenceRepo = residenceRepo;
    }

    @GetMapping
    public ResponseEntity<?> getStats() {
        long totalApplications = residenceRepo.count();
        long totalAccepted = residenceRepo.countByStatus("CERTIFICATE_ISSUED");
        long totalRejected = residenceRepo.countByStatusContaining("REJECTED");

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalApplications", totalApplications);
        stats.put("totalAccepted", totalAccepted);
        stats.put("totalRejected", totalRejected);

        return ResponseEntity.ok(stats);
    }
}
