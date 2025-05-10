package com.pbl5.autoattendance.repository;

import com.pbl5.autoattendance.embedded.AttendanceCheckId;
import com.pbl5.autoattendance.model.AttendanceCheck;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceCheckRepository extends JpaRepository<AttendanceCheck, AttendanceCheckId> {
}
