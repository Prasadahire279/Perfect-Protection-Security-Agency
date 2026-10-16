package com.perfectprotection.ppsa.repository;

import com.perfectprotection.ppsa.entity.CustomerEnquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CustomerEnquiryRepository extends JpaRepository<CustomerEnquiry, String> {
    List<CustomerEnquiry> findByStatus(CustomerEnquiry.EnquiryStatus status);
    List<CustomerEnquiry> findByEmailOrderByCreatedAtDesc(String email);
    long countByStatus(CustomerEnquiry.EnquiryStatus status);
    List<CustomerEnquiry> findAllByOrderByCreatedAtDesc();
}
