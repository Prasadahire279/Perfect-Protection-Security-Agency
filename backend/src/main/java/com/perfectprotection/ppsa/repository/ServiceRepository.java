package com.perfectprotection.ppsa.repository;

import com.perfectprotection.ppsa.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, String> {
    List<Service> findByCategory(Service.Category category);
    List<Service> findByStatus(Service.ServiceStatus status);
    List<Service> findByCategoryAndStatus(Service.Category category, Service.ServiceStatus status);
}
