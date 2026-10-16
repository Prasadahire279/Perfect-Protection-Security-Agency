package com.perfectprotection.ppsa.controller;

import com.perfectprotection.ppsa.dto.ApiResponse;
import com.perfectprotection.ppsa.entity.CustomerEnquiry;
import com.perfectprotection.ppsa.repository.CustomerEnquiryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/enquiries")
@CrossOrigin(origins = "*")
public class EnquiryController {

    @Autowired
    private CustomerEnquiryRepository enquiryRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllEnquiries(@RequestParam(required = false) String status) {
        List<CustomerEnquiry> enquiries;
        if (status != null && !status.isBlank()) {
            try {
                enquiries = enquiryRepository.findByStatus(
                        CustomerEnquiry.EnquiryStatus.valueOf(status.replace(" ", "_")));
            } catch (Exception e) {
                enquiries = enquiryRepository.findAllByOrderByCreatedAtDesc();
            }
        } else {
            enquiries = enquiryRepository.findAllByOrderByCreatedAtDesc();
        }
        return ResponseEntity.ok(ApiResponse.ok(enquiries));
    }

    // Public - any visitor can submit an enquiry
    @PostMapping
    public ResponseEntity<?> submitEnquiry(@RequestBody CustomerEnquiry enquiry) {
        String year = String.valueOf(LocalDate.now().getYear());
        long count = enquiryRepository.count();
        enquiry.setEnquiryId("ENQ-" + year + "-" + (501 + count));
        enquiry.setStatus(CustomerEnquiry.EnquiryStatus.New);
        enquiry.setEnquiryDate(LocalDate.now());

        CustomerEnquiry saved = enquiryRepository.save(enquiry);
        return ResponseEntity.ok(ApiResponse.ok("Enquiry submitted. Your ID: " + saved.getEnquiryId(), saved));
    }

    // Admin responds to enquiry
    @PatchMapping("/{id}/respond")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> respondToEnquiry(@PathVariable String id, @RequestBody Map<String, String> body) {
        String response = body.get("response");
        return enquiryRepository.findById(id).map(enq -> {
            enq.setAdminResponse(response);
            enq.setStatus(CustomerEnquiry.EnquiryStatus.Responded);
            enq.setRespondedAt(LocalDateTime.now());
            return ResponseEntity.ok(ApiResponse.ok("Response sent", enquiryRepository.save(enq)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return enquiryRepository.findById(id).map(enq -> {
            enq.setStatus(CustomerEnquiry.EnquiryStatus.valueOf(body.get("status").replace(" ", "_")));
            return ResponseEntity.ok(ApiResponse.ok("Status updated", enquiryRepository.save(enq)));
        }).orElse(ResponseEntity.notFound().build());
    }
}
