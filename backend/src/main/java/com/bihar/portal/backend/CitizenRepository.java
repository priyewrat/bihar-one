package com.bihar.portal.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CitizenRepository extends JpaRepository<Citizen, Long> {
    Optional<Citizen> findByEmail(String email);
    Optional<Citizen> findByAadharNumber(String aadharNumber);
    Optional<Citizen> findByPhoneNumber(String phoneNumber);

    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber); 
    boolean existsByAadharNumber(String aadharNumber);
}
