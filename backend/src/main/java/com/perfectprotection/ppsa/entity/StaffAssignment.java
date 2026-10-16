package com.perfectprotection.ppsa.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff_assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffAssignment {

    @Id
    @Column(name = "assignment_id", length = 25)
    private String assignmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id")
    private ServiceRequest request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    private Organization organization;

    @Column(name = "org_name", nullable = false, length = 200)
    private String orgName;

    @Column(name = "service_name", nullable = false, length = 150)
    private String serviceName;

    @Enumerated(EnumType.STRING)
    @Column(name = "staff_type", nullable = false)
    private StaffType staffType;

    @Column(name = "staff_id", nullable = false, length = 20)
    private String staffId;

    @Column(name = "staff_name", nullable = false, length = 150)
    private String staffName;

    @Column(nullable = false, length = 100)
    private String designation;

    @Column(nullable = false, length = 50)
    private String shift;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Enumerated(EnumType.STRING)
    private AssignmentStatus status = AssignmentStatus.Active;

    @Column(name = "assigned_date", nullable = false)
    private LocalDate assignedDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (assignedDate == null) assignedDate = LocalDate.now();
    }

    public enum StaffType { Security, Housekeeping }
    public enum AssignmentStatus { Active, Relieved, Transferred }
}
