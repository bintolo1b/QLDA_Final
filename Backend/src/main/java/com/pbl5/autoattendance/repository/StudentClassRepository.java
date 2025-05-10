package com.pbl5.autoattendance.repository;

import com.pbl5.autoattendance.embedded.StudentClassId;
import com.pbl5.autoattendance.model.Student;
import com.pbl5.autoattendance.model.StudentClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentClassRepository extends JpaRepository<StudentClass, StudentClassId> {
    List<StudentClass> findByStudent(Student student);
}
