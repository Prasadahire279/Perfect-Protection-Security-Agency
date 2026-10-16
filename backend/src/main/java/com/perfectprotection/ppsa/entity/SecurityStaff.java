package com.perfectprotection.ppsa.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "security_staff")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SecurityStaff {

    @Id
    @Column(name = "staff_id", length = 20)
    private String staffId;

    @Column(name = "badge_number", nullable = false, unique = true, length = 50)
    private String badgeNumber;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Designation designation;

    @Column(name = "joining_date", nullable = false)
    private LocalDate joiningDate;

    @Column(name = "experience_years")
    private Integer experienceYears = 1;

    @Column(length = 200)
    private String qualification;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Enumerated(EnumType.STRING)
    @Column(name = "shift_preference")
    private ShiftPreference shiftPreference = ShiftPreference.Morning;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_org_id")
    private Organization assignedOrg;

    @Enumerated(EnumType.STRING)
    private StaffStatus status = StaffStatus.Active;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public enum Designation {
        Security_Guard("Security Guard"),
        Senior_Security_Guard("Senior Security Guard"),
        Supervisor("Supervisor"),
        Security_Officer("Security Officer");

        private final String displayName;
        Designation(String displayName) { this.displayName = displayName; }
        public String getDisplayName() { return displayName; }
    }

    public enum ShiftPreference { Morning, Evening, Night, Rotational }
    public enum StaffStatus { Active, Inactive, On_Leave }
}
