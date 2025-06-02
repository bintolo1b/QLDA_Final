package com.pbl5.autoattendance.repository;

import com.pbl5.autoattendance.embedded.StudentClassId;
import com.pbl5.autoattendance.model.Class;
import com.pbl5.autoattendance.model.Student;
import com.pbl5.autoattendance.model.StudentClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudentClassRepository extends JpaRepository<StudentClass, StudentClassId> {
    List<StudentClass> findByStudent(Student student);

    @Query("SELECT sc FROM StudentClass sc WHERE sc.student = :student AND sc.aClass = :aClass")
    StudentClass findByStudentAndAClass(@Param("student") Student student, @Param("aClass") Class aClass);
}
