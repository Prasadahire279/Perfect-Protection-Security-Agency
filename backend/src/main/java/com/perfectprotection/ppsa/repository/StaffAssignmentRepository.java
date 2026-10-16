package com.perfectprotection.ppsa.repository;

import com.perfectprotection.ppsa.entity.StaffAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StaffAssignmentRepository extends JpaRepository<StaffAssignment, String> {
    List<StaffAssignment> findByOrganizationOrgId(String orgId);
    List<StaffAssignment> findByStaffId(String staffId);
    List<StaffAssignment> findByRequestRequestId(String requestId);
    List<StaffAssignment> findByStatus(StaffAssignment.AssignmentStatus status);
    long countByStatus(StaffAssignment.AssignmentStatus status);
}
