package com.perfectprotection.ppsa.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "services")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Service {

    @Id
    @Column(name = "service_id", length = 20)
    private String serviceId;

    @Column(name = "service_name", nullable = false, length = 150)
    private String serviceName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String responsibilities;

    @Column(name = "available_shifts", nullable = false, length = 150)
    private String availableShifts;

    @Column(name = "minimum_staff")
    private Integer minimumStaff = 2;

    @Column(name = "duration_options", length = 150)
    private String durationOptions;

    @Column(length = 50)
    private String availability = "Available Immediate";

    @Enumerated(EnumType.STRING)
    private ServiceStatus status = ServiceStatus.Active;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public enum Category { Security, Housekeeping }
    public enum ServiceStatus { Active, Inactive }
}
