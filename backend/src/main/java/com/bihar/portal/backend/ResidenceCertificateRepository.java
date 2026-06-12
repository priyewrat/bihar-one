package com.bihar.portal.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface ResidenceCertificateRepository extends JpaRepository<ResidenceCertificate, Long> {
    Optional<ResidenceCertificate> findByApplicationNumber(String applicationNumber);
    Optional<ResidenceCertificate> findByCertificateNumber(String certificateNumber);

    boolean existsByEmail(String email);
    boolean existsByAadharNumber(String aadharNumber);

    // --- Dashboard counts ---
    long count();  // total applications
    long countByStatus(String status);  // e.g. CERTIFICATE_ISSUED
    long countByStatusContaining(String status);  // e.g. REJECTED_BY_RO, REJECTED_BY_SDM, etc.

    // --- Workflow updates ---
    @Transactional
    @Modifying
    @Query("UPDATE ResidenceCertificate c SET c.status = 'APPROVED_BY_RO' WHERE c.applicationNumber = ?1 AND c.verificationLevel <> 'BLOCK'")
    void approveByROForward(String applicationNumber);

    @Transactional
    @Modifying
    @Query("UPDATE ResidenceCertificate c SET c.status = 'CERTIFICATE_ISSUED', c.certificateNumber = CONCAT('CERT-', CURRENT_TIMESTAMP) WHERE c.applicationNumber = ?1 AND c.verificationLevel = 'BLOCK'")
    void approveByROFinal(String applicationNumber);

    @Transactional
    @Modifying
    @Query("UPDATE ResidenceCertificate c SET c.status = 'APPROVED_BY_SDM' WHERE c.applicationNumber = ?1 AND c.verificationLevel = 'DISTRICT'")
    void approveBySDMForward(String applicationNumber);

    @Transactional
    @Modifying
    @Query("UPDATE ResidenceCertificate c SET c.status = 'CERTIFICATE_ISSUED', c.certificateNumber = CONCAT('CERT-', CURRENT_TIMESTAMP) WHERE c.applicationNumber = ?1 AND c.verificationLevel = 'SUB_DIVISION'")
    void approveBySDMFinal(String applicationNumber);

    @Transactional
    @Modifying
    @Query("UPDATE ResidenceCertificate c SET c.status = 'CERTIFICATE_ISSUED', c.certificateNumber = CONCAT('CERT-', CURRENT_TIMESTAMP) WHERE c.applicationNumber = ?1 AND c.verificationLevel = 'DISTRICT'")
    void approveByDMFinal(String applicationNumber);
}
