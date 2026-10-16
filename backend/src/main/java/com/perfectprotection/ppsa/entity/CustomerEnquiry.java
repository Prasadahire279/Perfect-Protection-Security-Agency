package com.perfectprotection.ppsa.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_enquiries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerEnquiry {

    @Id
    @Column(name = "enquiry_id", length = 25)
    private String enquiryId;

    @Column(name = "customer_name", nullable = false, length = 150)
    private String customerName;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(length = 200)
    private String organization = "General Institution Enquiry";

    @Column(nullable = false, length = 150)
    private String service;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "enquiry_date", nullable = false)
    private LocalDate enquiryDate;

    @Enumerated(EnumType.STRING)
    private EnquiryStatus status = EnquiryStatus.New;

    @Column(name = "admin_response", columnDefinition = "TEXT")
    private String adminResponse;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (enquiryDate == null) enquiryDate = LocalDate.now();
    }

    public enum EnquiryStatus { New, In_Progress, Responded, Closed }
}
