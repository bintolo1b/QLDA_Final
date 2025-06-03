package com.pbl5.autoattendance.repository;

import com.pbl5.autoattendance.model.Student;
import com.pbl5.autoattendance.model.StudentVector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentVectorRepository extends JpaRepository<StudentVector, Integer> {
    StudentVector findByStudent(Student student);
}
