package com.perfectprotection.ppsa.repository;

import com.perfectprotection.ppsa.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, String> {
    List<ServiceRequest> findByStatus(ServiceRequest.RequestStatus status);
    List<ServiceRequest> findByOrgNameContainingIgnoreCase(String orgName);
    long countByStatus(ServiceRequest.RequestStatus status);
    List<ServiceRequest> findAllByOrderByCreatedAtDesc();
}
