package com.perfectprotection.ppsa.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff_attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffAttendance {

    @Id
    @Column(name = "attendance_id", length = 25)
    private String attendanceId;

    @Column(name = "shift_date", nullable = false)
    private LocalDate shiftDate;

    @Column(name = "staff_id", nullable = false, length = 20)
    private String staffId;

    @Column(name = "staff_name", nullable = false, length = 150)
    private String staffName;

    @Enumerated(EnumType.STRING)
    @Column(name = "staff_type", nullable = false)
    private StaffType staffType;

    @Column(name = "org_name", nullable = false, length = 200)
    private String orgName;

    @Column(name = "check_in", length = 20)
    private String checkIn = "--:--";

    @Column(name = "check_out", length = 20)
    private String checkOut = "--:--";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceStatus status = AttendanceStatus.Present;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "logged_at")
    private LocalDateTime loggedAt;

    @PrePersist
    protected void onCreate() { loggedAt = LocalDateTime.now(); }

    public enum StaffType { Security, Housekeeping }
    public enum AttendanceStatus { Present, Absent, Leave }
}
