package com.perfectprotection.ppsa.controller;

import com.perfectprotection.ppsa.dto.ApiResponse;
import com.perfectprotection.ppsa.dto.DashboardStats;
import com.perfectprotection.ppsa.entity.*;
import com.perfectprotection.ppsa.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired private OrganizationRepository organizationRepository;
    @Autowired private SecurityStaffRepository securityStaffRepository;
    @Autowired private HousekeepingStaffRepository hkRepository;
    @Autowired private ServiceRequestRepository requestRepository;
    @Autowired private StaffAssignmentRepository assignmentRepository;
    @Autowired private StaffAttendanceRepository attendanceRepository;
    @Autowired private CustomerEnquiryRepository enquiryRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        DashboardStats stats = new DashboardStats();

        // KPI counts
        stats.setTotalOrganizations(organizationRepository.count());
        stats.setTotalSecurityStaff(securityStaffRepository.countByStatus(SecurityStaff.StaffStatus.Active));
        stats.setTotalHousekeepingStaff(hkRepository.countByStatus(HousekeepingStaff.HkStatus.Active));
        stats.setActiveDeployments(assignmentRepository.countByStatus(StaffAssignment.AssignmentStatus.Active));
        stats.setPendingRequests(requestRepository.countByStatus(ServiceRequest.RequestStatus.Pending)
                + requestRepository.countByStatus(ServiceRequest.RequestStatus.Under_Review));
        stats.setActiveServices(requestRepository.countByStatus(ServiceRequest.RequestStatus.Active));

        // Attendance % today
        LocalDate today = LocalDate.now();
        long present = attendanceRepository.countPresentOnDate(today);
        long total = attendanceRepository.countTotalOnDate(today);
        stats.setTodayAttendancePercent(total > 0 ? Math.round(present * 100.0 / total) : 0);

        stats.setPendingEnquiries(enquiryRepository.countByStatus(CustomerEnquiry.EnquiryStatus.New)
                + enquiryRepository.countByStatus(CustomerEnquiry.EnquiryStatus.In_Progress));

        // Staff distribution chart data
        Map<String, Long> staffDist = new LinkedHashMap<>();
        staffDist.put("Security", securityStaffRepository.countByStatus(SecurityStaff.StaffStatus.Active));
        staffDist.put("Housekeeping", hkRepository.countByStatus(HousekeepingStaff.HkStatus.Active));
        stats.setStaffDistribution(staffDist);

        // Request status chart data
        Map<String, Long> requestCounts = new LinkedHashMap<>();
        for (ServiceRequest.RequestStatus s : ServiceRequest.RequestStatus.values()) {
            requestCounts.put(s.getDisplayName(), requestRepository.countByStatus(s));
        }
        stats.setRequestStatusCounts(requestCounts);

        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/recent-requests")
    public ResponseEntity<?> getRecentRequests() {
        List<ServiceRequest> requests = requestRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(ApiResponse.ok(requests.stream().limit(10).toList()));
    }

    @GetMapping("/recent-enquiries")
    public ResponseEntity<?> getRecentEnquiries() {
        List<CustomerEnquiry> enquiries = enquiryRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(ApiResponse.ok(enquiries.stream().limit(10).toList()));
    }
}
