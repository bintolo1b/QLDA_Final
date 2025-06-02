package com.pbl5.autoattendance.repository;

import com.pbl5.autoattendance.model.Teacher;
import com.pbl5.autoattendance.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Integer> {
    Optional<Teacher> findByUser(User user);
    Teacher findByEmail(String email);

    Teacher findByUser_Username(String username);
}
