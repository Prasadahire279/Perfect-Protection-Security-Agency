package com.perfectprotection.ppsa.dto;

import lombok.Data;
import java.util.Map;

@Data
public class DashboardStats {
    private long totalOrganizations;
    private long totalSecurityStaff;
    private long totalHousekeepingStaff;
    private long activeDeployments;
    private long pendingRequests;
    private long activeServices;
    private double todayAttendancePercent;
    private long pendingEnquiries;

    // Chart data
    private Map<String, Long> staffDistribution;
    private Map<String, Long> requestStatusCounts;
}
