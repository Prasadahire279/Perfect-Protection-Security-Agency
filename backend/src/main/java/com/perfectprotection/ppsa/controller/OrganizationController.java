package com.perfectprotection.ppsa.controller;

import com.perfectprotection.ppsa.dto.ApiResponse;
import com.perfectprotection.ppsa.entity.Organization;
import com.perfectprotection.ppsa.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/organizations")
@CrossOrigin(origins = "*")
public class OrganizationController {

    @Autowired
    private OrganizationRepository organizationRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllOrganizations(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type) {

        List<Organization> orgs;
        if ((search == null || search.isBlank()) && (type == null || type.equals("All"))) {
            orgs = organizationRepository.findAll();
        } else {
            Organization.OrgType orgType = null;
            if (type != null && !type.equals("All")) {
                try { orgType = Organization.OrgType.valueOf(type.replace(" ", "_")); } catch (Exception ignored) {}
            }
            orgs = organizationRepository.searchOrganizations(search, orgType);
        }
        return ResponseEntity.ok(ApiResponse.ok(orgs));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getOrganization(@PathVariable String id) {
        return organizationRepository.findById(id)
                .map(o -> ResponseEntity.ok(ApiResponse.ok(o)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createOrganization(@RequestBody Organization org) {
        // Auto-generate ID
        long count = organizationRepository.count();
        org.setOrgId("ORG-" + (1001 + count));
        if (org.getCreatedDate() == null) org.setCreatedDate(LocalDate.now());
        Organization saved = organizationRepository.save(org);
        return ResponseEntity.ok(ApiResponse.ok("Organization created", saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrganization(@PathVariable String id, @RequestBody Organization updated) {
        return organizationRepository.findById(id).map(org -> {
            org.setOrgName(updated.getOrgName());
            org.setOrgType(updated.getOrgType());
            org.setContactPerson(updated.getContactPerson());
            org.setPhone(updated.getPhone());
            org.setEmail(updated.getEmail());
            org.setAddress(updated.getAddress());
            org.setCity(updated.getCity());
            org.setState(updated.getState());
            org.setPincode(updated.getPincode());
            org.setRequiredStaff(updated.getRequiredStaff());
            org.setStatus(updated.getStatus());
            return ResponseEntity.ok(ApiResponse.ok("Organization updated", organizationRepository.save(org)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleStatus(@PathVariable String id) {
        return organizationRepository.findById(id).map(org -> {
            org.setStatus(org.getStatus() == Organization.OrgStatus.Active
                    ? Organization.OrgStatus.Deactivated
                    : Organization.OrgStatus.Active);
            return ResponseEntity.ok(ApiResponse.ok("Status updated", organizationRepository.save(org)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteOrganization(@PathVariable String id) {
        if (!organizationRepository.existsById(id)) return ResponseEntity.notFound().build();
        organizationRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Organization deleted", null));
    }
}
