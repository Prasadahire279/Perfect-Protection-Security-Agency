package com.perfectprotection.ppsa.repository;

import com.perfectprotection.ppsa.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, String> {
    List<Organization> findByStatus(Organization.OrgStatus status);
    List<Organization> findByOrgType(Organization.OrgType orgType);

    @Query("SELECT o FROM Organization o WHERE " +
           "(:search IS NULL OR LOWER(o.orgName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(o.contactPerson) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:type IS NULL OR o.orgType = :type)")
    List<Organization> searchOrganizations(String search, Organization.OrgType type);

    long countByStatus(Organization.OrgStatus status);
}
