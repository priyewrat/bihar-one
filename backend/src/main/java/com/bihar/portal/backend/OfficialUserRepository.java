package com.bihar.portal.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OfficialUserRepository extends JpaRepository<OfficialUser, Long> {
    Optional<OfficialUser> findByEmail(String email);
    boolean existsByEmail(String email);
}
