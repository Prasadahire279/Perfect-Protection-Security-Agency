package com.perfectprotection.ppsa.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRequest {

    @Id
    @Column(name = "request_id", length = 25)
    private String requestId;

    @Column(name = "org_name", nullable = false, length = 200)
    private String orgName;

    @Column(name = "org_type", nullable = false, length = 100)
    private String orgType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @Column(name = "service_name", nullable = false, length = 150)
    private String serviceName;

    @Column(name = "security_guards")
    private Integer securityGuards = 0;

    @Column(name = "supervisors")
    private Integer supervisors = 0;

    @Column(name = "housekeeping_staff")
    private Integer housekeepingStaff = 0;

    @Column(name = "total_staff", nullable = false)
    private Integer totalStaff;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Shift shift;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(length = 50)
    private String duration = "12 Months";

    @Column(name = "working_days", length = 100)
    private String workingDays = "Monday to Saturday";

    @Column(name = "contact_person", nullable = false, length = 150)
    private String contactPerson;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.Pending;

    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (requestDate == null) requestDate = LocalDate.now();
    }

    public enum Shift { Morning, Evening, Night, Full_Day, Rotational }

    public enum RequestStatus {
        Pending, Under_Review, Approved, Staff_Assigned, Active, Completed, Rejected;

        public String getDisplayName() {
            return this.name().replace("_", " ");
        }
    }
}
