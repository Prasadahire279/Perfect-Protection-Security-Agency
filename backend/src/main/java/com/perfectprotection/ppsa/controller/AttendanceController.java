package com.perfectprotection.ppsa.controller;

import com.perfectprotection.ppsa.dto.ApiResponse;
import com.perfectprotection.ppsa.entity.StaffAttendance;
import com.perfectprotection.ppsa.repository.StaffAttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/attendance")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AttendanceController {

    @Autowired
    private StaffAttendanceRepository attendanceRepository;

    @GetMapping
    public ResponseEntity<?> getAttendance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String orgName) {

        List<StaffAttendance> records;
        LocalDate queryDate = (date != null) ? date : LocalDate.now();

        if (orgName != null && !orgName.isBlank()) {
            records = attendanceRepository.findByShiftDateAndOrgNameContainingIgnoreCase(queryDate, orgName);
        } else {
            records = attendanceRepository.findByShiftDate(queryDate);
        }
        return ResponseEntity.ok(ApiResponse.ok(records));
    }

    @PostMapping
    public ResponseEntity<?> logAttendance(@RequestBody StaffAttendance record) {
        if (record.getShiftDate() == null) record.setShiftDate(LocalDate.now());

        // Check for duplicate
        if (attendanceRepository.existsByShiftDateAndStaffId(record.getShiftDate(), record.getStaffId())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Attendance already logged for this staff on " + record.getShiftDate()));
        }

        // Auto-generate ID
        long count = attendanceRepository.count();
        String year = String.valueOf(LocalDate.now().getYear());
        record.setAttendanceId("ATT-" + year + "-" + (901 + count));

        return ResponseEntity.ok(ApiResponse.ok("Attendance logged", attendanceRepository.save(record)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAttendance(@PathVariable String id, @RequestBody StaffAttendance updated) {
        return attendanceRepository.findById(id).map(record -> {
            record.setCheckIn(updated.getCheckIn());
            record.setCheckOut(updated.getCheckOut());
            record.setStatus(updated.getStatus());
            record.setRemarks(updated.getRemarks());
            return ResponseEntity.ok(ApiResponse.ok("Attendance updated", attendanceRepository.save(record)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats/today")
    public ResponseEntity<?> getTodayStats() {
        LocalDate today = LocalDate.now();
        long present = attendanceRepository.countPresentOnDate(today);
        long total = attendanceRepository.countTotalOnDate(today);
        double percentage = total > 0 ? (present * 100.0 / total) : 0;

        return ResponseEntity.ok(ApiResponse.ok(java.util.Map.of(
                "date", today,
                "present", present,
                "total", total,
                "attendancePercent", Math.round(percentage)
        )));
    }
}
