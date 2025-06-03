package com.pbl5.autoattendance.repository;

import com.pbl5.autoattendance.embedded.AttendanceCheckId;
import com.pbl5.autoattendance.model.AttendanceCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceCheckRepository extends JpaRepository<AttendanceCheck, AttendanceCheckId> {
    List<AttendanceCheck> findByStatusIsNull();
}
