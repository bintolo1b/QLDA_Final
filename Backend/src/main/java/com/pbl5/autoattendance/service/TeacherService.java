package com.pbl5.autoattendance.service;

import com.pbl5.autoattendance.dto.TeacherDTO;
import com.pbl5.autoattendance.model.Teacher;
import com.pbl5.autoattendance.model.User;
import com.pbl5.autoattendance.repository.TeacherRepository;
import com.pbl5.autoattendance.repository.UserRepository;
import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TeacherService {
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;

    public TeacherService(TeacherRepository teacherRepository, UserRepository userRepository) {
        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
    }

    public void saveTeacher(Teacher teacher) {
        teacherRepository.save(teacher);
    }

    public Teacher getTeacherById(Integer teacherId) {
        return teacherRepository.findById(teacherId).orElse(null);
    }

    public Teacher getTeacherByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return null;
        }
        return teacherRepository.findByUser(user).orElse(null);
    }

    public Teacher findTeacherByEmail(String email) {
        return teacherRepository.findByEmail(email);
    }

    public void updateTeacher(TeacherDTO teacherDTO, String username) {
        Teacher teacher = getTeacherByUsername(username);
        teacher.setEmail(teacherDTO.getEmail());
        teacher.setName(teacherDTO.getName());
        teacher.setPhone(teacherDTO.getPhone());
        teacherRepository.save(teacher);
    }
}
