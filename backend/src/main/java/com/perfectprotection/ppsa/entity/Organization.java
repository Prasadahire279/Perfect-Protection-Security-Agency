package com.perfectprotection.ppsa.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "organizations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organization {

    @Id
    @Column(name = "org_id", length = 20)
    private String orgId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "org_name", nullable = false, length = 200)
    private String orgName;

    @Enumerated(EnumType.STRING)
    @Column(name = "org_type", nullable = false)
    private OrgType orgType;

    @Column(name = "contact_person", nullable = false, length = 150)
    private String contactPerson;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(length = 100)
    private String city = "Capital City";

    @Column(length = 100)
    private String state = "Maharashtra";

    @Column(length = 10)
    private String pincode = "400001";

    @Column(name = "required_staff")
    private Integer requiredStaff = 4;

    @Column(name = "assigned_staff")
    private Integer assignedStaff = 0;

    @Enumerated(EnumType.STRING)
    private OrgStatus status = OrgStatus.Active;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (createdDate == null) createdDate = LocalDate.now();
    }

    public enum OrgType {
        Government_School("Government School"),
        Government_Office("Government Office"),
        College("College"),
        Hospital("Hospital"),
        Factory("Factory"),
        Commercial_Organization("Commercial Organization"),
        Other("Other");

        private final String displayName;
        OrgType(String displayName) { this.displayName = displayName; }
        public String getDisplayName() { return displayName; }
    }

    public enum OrgStatus {
        Active, Pending_Assignment("Pending Assignment"), Deactivated;

        private String displayName;
        OrgStatus() { this.displayName = this.name(); }
        OrgStatus(String displayName) { this.displayName = displayName; }
        public String getDisplayName() { return displayName; }
    }
}
