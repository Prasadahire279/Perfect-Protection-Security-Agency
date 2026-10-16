package com.perfectprotection.ppsa.controller;

import com.perfectprotection.ppsa.dto.ApiResponse;
import com.perfectprotection.ppsa.entity.HousekeepingStaff;
import com.perfectprotection.ppsa.repository.HousekeepingStaffRepository;
import com.perfectprotection.ppsa.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/housekeeping-staff")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class HousekeepingStaffController {

    @Autowired private HousekeepingStaffRepository hkRepository;
    @Autowired private OrganizationRepository organizationRepository;

    @GetMapping
    public ResponseEntity<?> getAllStaff(
            @RequestParam(required = false) boolean availableOnly) {
        List<HousekeepingStaff> staff = availableOnly
                ? hkRepository.findAvailableStaff()
                : hkRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok(staff));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStaff(@PathVariable String id) {
        return hkRepository.findById(id)
                .map(s -> ResponseEntity.ok(ApiResponse.ok(s)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> addStaff(@RequestBody HousekeepingStaff staff) {
        long count = hkRepository.count();
        staff.setStaffId("HK-" + (201 + count));
        return ResponseEntity.ok(ApiResponse.ok("Housekeeping staff added", hkRepository.save(staff)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStaff(@PathVariable String id, @RequestBody HousekeepingStaff updated) {
        return hkRepository.findById(id).map(s -> {
            s.setFullName(updated.getFullName());
            s.setPhone(updated.getPhone());
            s.setAddress(updated.getAddress());
            s.setDesignation(updated.getDesignation());
            s.setExperienceYears(updated.getExperienceYears());
            s.setQualification(updated.getQualification());
            s.setSkills(updated.getSkills());
            s.setShiftPreference(updated.getShiftPreference());
            s.setStatus(updated.getStatus());
            return ResponseEntity.ok(ApiResponse.ok("Staff updated", hkRepository.save(s)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<?> assignToOrg(@PathVariable String id, @RequestBody Map<String, String> body) {
        String orgId = body.get("orgId");
        return hkRepository.findById(id).map(s -> {
            if (orgId == null || orgId.isBlank()) {
                s.setAssignedOrg(null);
            } else {
                organizationRepository.findById(orgId).ifPresent(s::setAssignedOrg);
            }
            return ResponseEntity.ok(ApiResponse.ok("Assignment updated", hkRepository.save(s)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable String id) {
        if (!hkRepository.existsById(id)) return ResponseEntity.notFound().build();
        hkRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Staff record deleted", null));
    }
}
