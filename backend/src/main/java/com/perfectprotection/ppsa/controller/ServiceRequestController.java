package com.perfectprotection.ppsa.controller;

import com.perfectprotection.ppsa.dto.ApiResponse;
import com.perfectprotection.ppsa.entity.ServiceRequest;
import com.perfectprotection.ppsa.repository.ServiceRepository;
import com.perfectprotection.ppsa.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/service-requests")
@CrossOrigin(origins = "*")
public class ServiceRequestController {

    @Autowired private ServiceRequestRepository requestRepository;
    @Autowired private ServiceRepository serviceRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllRequests(
            @RequestParam(required = false) String status) {
        List<ServiceRequest> requests;
        if (status != null && !status.isBlank()) {
            try {
                requests = requestRepository.findByStatus(
                        ServiceRequest.RequestStatus.valueOf(status.replace(" ", "_")));
            } catch (Exception e) {
                requests = requestRepository.findAllByOrderByCreatedAtDesc();
            }
        } else {
            requests = requestRepository.findAllByOrderByCreatedAtDesc();
        }
        return ResponseEntity.ok(ApiResponse.ok(requests));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRequest(@PathVariable String id) {
        return requestRepository.findById(id)
                .map(r -> ResponseEntity.ok(ApiResponse.ok(r)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Public endpoint - any visitor can submit a service request
    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody ServiceRequest req) {
        // Auto-generate request ID
        String year = String.valueOf(LocalDate.now().getYear());
        long count = requestRepository.count();
        req.setRequestId("REQ-" + year + "-" + (1001 + count));
        req.setStatus(ServiceRequest.RequestStatus.Pending);
        req.setRequestDate(LocalDate.now());

        // Link service entity
        if (req.getService() != null && req.getService().getServiceId() != null) {
            serviceRepository.findById(req.getService().getServiceId())
                    .ifPresent(req::setService);
        }

        ServiceRequest saved = requestRepository.save(req);
        return ResponseEntity.ok(ApiResponse.ok("Request submitted successfully!", saved));
    }

    // Admin workflow: advance request status
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        return requestRepository.findById(id).map(req -> {
            try {
                req.setStatus(ServiceRequest.RequestStatus.valueOf(newStatus.replace(" ", "_")));
                return ResponseEntity.ok(ApiResponse.ok("Status updated", requestRepository.save(req)));
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Invalid status: " + newStatus));
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteRequest(@PathVariable String id) {
        if (!requestRepository.existsById(id)) return ResponseEntity.notFound().build();
        requestRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Request deleted", null));
    }
}
