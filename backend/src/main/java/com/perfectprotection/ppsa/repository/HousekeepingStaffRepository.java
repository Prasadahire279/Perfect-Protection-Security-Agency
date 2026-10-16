package com.perfectprotection.ppsa.repository;

import com.perfectprotection.ppsa.entity.HousekeepingStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HousekeepingStaffRepository extends JpaRepository<HousekeepingStaff, String> {
    List<HousekeepingStaff> findByStatus(HousekeepingStaff.HkStatus status);
    List<HousekeepingStaff> findByAssignedOrgOrgId(String orgId);

    @Query("SELECT h FROM HousekeepingStaff h WHERE h.assignedOrg IS NULL AND h.status = 'Active'")
    List<HousekeepingStaff> findAvailableStaff();

    long countByStatus(HousekeepingStaff.HkStatus status);
}
