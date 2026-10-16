package com.perfectprotection.ppsa.repository;

import com.perfectprotection.ppsa.entity.SecurityStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SecurityStaffRepository extends JpaRepository<SecurityStaff, String> {
    List<SecurityStaff> findByStatus(SecurityStaff.StaffStatus status);
    List<SecurityStaff> findByAssignedOrgOrgId(String orgId);
    List<SecurityStaff> findByAssignedOrgIsNull();

    @Query("SELECT s FROM SecurityStaff s WHERE s.assignedOrg IS NULL AND s.status = 'Active'")
    List<SecurityStaff> findAvailableStaff();

    long countByStatus(SecurityStaff.StaffStatus status);
    long countByAssignedOrgIsNotNull();
}
