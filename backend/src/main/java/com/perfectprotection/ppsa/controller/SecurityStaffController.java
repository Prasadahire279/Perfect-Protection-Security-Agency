package com.perfectprotection.ppsa.controller;

import com.perfectprotection.ppsa.dto.ApiResponse;
import com.perfectprotection.ppsa.entity.SecurityStaff;
import com.perfectprotection.ppsa.repository.OrganizationRepository;
import com.perfectprotection.ppsa.repository.SecurityStaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/security-staff")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class SecurityStaffController {

    @Autowired private SecurityStaffRepository securityStaffRepository;
    @Autowired private OrganizationRepository organizationRepository;

    @GetMapping
    public ResponseEntity<?> getAllStaff(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) boolean availableOnly) {

        List<SecurityStaff> staff;
        if (availableOnly) {
            staff = securityStaffRepository.findAvailableStaff();
        } else if (status != null && !status.isBlank()) {
            try {
                staff = securityStaffRepository.findByStatus(
                        SecurityStaff.StaffStatus.valueOf(status.replace(" ", "_")));
            } catch (Exception e) {
                staff = securityStaffRepository.findAll();
            }
        } else {
            staff = securityStaffRepository.findAll();
        }
        return ResponseEntity.ok(ApiResponse.ok(staff));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStaff(@PathVariable String id) {
        return securityStaffRepository.findById(id)
                .map(s -> ResponseEntity.ok(ApiResponse.ok(s)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> addStaff(@RequestBody SecurityStaff staff) {
        long count = securityStaffRepository.count();
        staff.setStaffId("SEC-" + (101 + count));
        return ResponseEntity.ok(ApiResponse.ok("Security staff added", securityStaffRepository.save(staff)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStaff(@PathVariable String id, @RequestBody SecurityStaff updated) {
        return securityStaffRepository.findById(id).map(s -> {
            s.setFullName(updated.getFullName());
            s.setPhone(updated.getPhone());
            s.setAddress(updated.getAddress());
            s.setDesignation(updated.getDesignation());
            s.setExperienceYears(updated.getExperienceYears());
            s.setQualification(updated.getQualification());
            s.setSkills(updated.getSkills());
            s.setShiftPreference(updated.getShiftPreference());
            s.setStatus(updated.getStatus());
            return ResponseEntity.ok(ApiResponse.ok("Staff updated", securityStaffRepository.save(s)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<?> assignToOrg(@PathVariable String id, @RequestBody Map<String, String> body) {
        String orgId = body.get("orgId");
        return securityStaffRepository.findById(id).map(s -> {
            if (orgId == null || orgId.isBlank()) {
                s.setAssignedOrg(null);
            } else {
                organizationRepository.findById(orgId).ifPresent(s::setAssignedOrg);
            }
            return ResponseEntity.ok(ApiResponse.ok("Assignment updated", securityStaffRepository.save(s)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable String id) {
        if (!securityStaffRepository.existsById(id)) return ResponseEntity.notFound().build();
        securityStaffRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Staff record deleted", null));
    }
}
