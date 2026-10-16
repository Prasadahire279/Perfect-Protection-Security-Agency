package com.perfectprotection.ppsa.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "housekeeping_staff")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HousekeepingStaff {

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
    private HkStatus status = HkStatus.Active;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public enum Designation {
        Housekeeping_Staff("Housekeeping Staff"),
        Cleaning_Supervisor("Cleaning Supervisor"),
        Facility_Support_Staff("Facility Support Staff"),
        Sanitation_Staff("Sanitation Staff"),
        Office_Cleaning_Staff("Office Cleaning Staff"),
        School_Cleaning_Staff("School Cleaning Staff");

        private final String displayName;
        Designation(String displayName) { this.displayName = displayName; }
        public String getDisplayName() { return displayName; }
    }

    public enum ShiftPreference { Morning, Evening, Full_Day }
    public enum HkStatus { Active, Inactive, On_Leave }
}
