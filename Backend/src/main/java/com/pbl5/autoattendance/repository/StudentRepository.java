package com.pbl5.autoattendance.repository;

import com.pbl5.autoattendance.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    Student findByUser_Username(String username);

    Student findByEmail(String email);
}
