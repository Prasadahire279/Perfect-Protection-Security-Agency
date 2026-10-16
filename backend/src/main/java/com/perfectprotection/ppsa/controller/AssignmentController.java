package com.perfectprotection.ppsa.controller;

import com.perfectprotection.ppsa.dto.ApiResponse;
import com.perfectprotection.ppsa.entity.*;
import com.perfectprotection.ppsa.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/assignments")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AssignmentController {

    @Autowired private StaffAssignmentRepository assignmentRepository;
    @Autowired private OrganizationRepository organizationRepository;
    @Autowired private ServiceRequestRepository requestRepository;
    @Autowired private SecurityStaffRepository securityStaffRepository;
    @Autowired private HousekeepingStaffRepository hkRepository;

    @GetMapping
    public ResponseEntity<?> getAllAssignments(
            @RequestParam(required = false) String orgId) {
        List<StaffAssignment> assignments = orgId != null
                ? assignmentRepository.findByOrganizationOrgId(orgId)
                : assignmentRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok(assignments));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAssignment(@PathVariable String id) {
        return assignmentRepository.findById(id)
                .map(a -> ResponseEntity.ok(ApiResponse.ok(a)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createAssignment(@RequestBody StaffAssignment assignment) {
        String year = String.valueOf(LocalDate.now().getYear());
        long count = assignmentRepository.count();
        assignment.setAssignmentId("ASG-" + year + "-" + (301 + count));
        assignment.setAssignedDate(LocalDate.now());
        assignment.setStatus(StaffAssignment.AssignmentStatus.Active);

        // Link organization
        if (assignment.getOrganization() != null && assignment.getOrganization().getOrgId() != null) {
            organizationRepository.findById(assignment.getOrganization().getOrgId())
                    .ifPresent(org -> {
                        assignment.setOrganization(org);
                        assignment.setOrgName(org.getOrgName());
                        // Update org assigned staff count
                        org.setAssignedStaff(org.getAssignedStaff() + 1);
                        organizationRepository.save(org);
                    });
        }

        // Link request
        if (assignment.getRequest() != null && assignment.getRequest().getRequestId() != null) {
            requestRepository.findById(assignment.getRequest().getRequestId())
                    .ifPresent(req -> {
                        assignment.setRequest(req);
                        // Auto-advance request status
                        if (req.getStatus() == ServiceRequest.RequestStatus.Approved) {
                            req.setStatus(ServiceRequest.RequestStatus.Staff_Assigned);
                            requestRepository.save(req);
                        }
                    });
        }

        // Auto-assign staff to org
        if (assignment.getStaffType() == StaffAssignment.StaffType.Security) {
            securityStaffRepository.findById(assignment.getStaffId()).ifPresent(s -> {
                assignment.setStaffName(s.getFullName());
                s.setAssignedOrg(assignment.getOrganization());
                securityStaffRepository.save(s);
            });
        } else {
            hkRepository.findById(assignment.getStaffId()).ifPresent(s -> {
                assignment.setStaffName(s.getFullName());
                s.setAssignedOrg(assignment.getOrganization());
                hkRepository.save(s);
            });
        }

        StaffAssignment saved = assignmentRepository.save(assignment);
        return ResponseEntity.ok(ApiResponse.ok("Staff assigned successfully! ID: " + saved.getAssignmentId(), saved));
    }

    @PatchMapping("/{id}/relieve")
    public ResponseEntity<?> relieveStaff(@PathVariable String id) {
        return assignmentRepository.findById(id).map(a -> {
            a.setStatus(StaffAssignment.AssignmentStatus.Relieved);

            // Unassign staff from org
            if (a.getStaffType() == StaffAssignment.StaffType.Security) {
                securityStaffRepository.findById(a.getStaffId()).ifPresent(s -> {
                    s.setAssignedOrg(null);
                    securityStaffRepository.save(s);
                });
            } else {
                hkRepository.findById(a.getStaffId()).ifPresent(s -> {
                    s.setAssignedOrg(null);
                    hkRepository.save(s);
                });
            }

            // Update org assigned count
            if (a.getOrganization() != null) {
                a.getOrganization().setAssignedStaff(
                        Math.max(0, a.getOrganization().getAssignedStaff() - 1));
                organizationRepository.save(a.getOrganization());
            }

            return ResponseEntity.ok(ApiResponse.ok("Staff relieved", assignmentRepository.save(a)));
        }).orElse(ResponseEntity.notFound().build());
    }
}
