package com.perfectprotection.ppsa.repository;

import com.perfectprotection.ppsa.entity.StaffAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface StaffAttendanceRepository extends JpaRepository<StaffAttendance, String> {
    List<StaffAttendance> findByShiftDate(LocalDate shiftDate);
    List<StaffAttendance> findByStaffId(String staffId);
    List<StaffAttendance> findByShiftDateAndOrgNameContainingIgnoreCase(LocalDate date, String orgName);
    boolean existsByShiftDateAndStaffId(LocalDate date, String staffId);

    @Query("SELECT COUNT(a) FROM StaffAttendance a WHERE a.shiftDate = :date AND a.status = 'Present'")
    long countPresentOnDate(LocalDate date);

    @Query("SELECT COUNT(a) FROM StaffAttendance a WHERE a.shiftDate = :date")
    long countTotalOnDate(LocalDate date);
}
