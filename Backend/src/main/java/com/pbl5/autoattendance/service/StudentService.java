package com.pbl5.autoattendance.service;

import com.pbl5.autoattendance.dto.ApiResponse;
import com.pbl5.autoattendance.dto.StudentDTO;
import com.pbl5.autoattendance.exception.AppException;
import com.pbl5.autoattendance.exception.ErrorCode;
import com.pbl5.autoattendance.mapper.IStudentMapper;
import com.pbl5.autoattendance.model.Student;
import com.pbl5.autoattendance.repository.StudentRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StudentService {
    StudentRepository studentRepository;
    IStudentMapper studentMapper;

    public void saveStudent(Student student) {
        studentRepository.save(student);
    }

    public Student getStudentByUsername(String username) {
        return studentRepository.findByUser_Username(username);
    }

    public Student findByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    public StudentDTO findById(Integer id) {
        Student student = studentRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_EXISTED));
        return studentMapper.toStudentDTO(student);
    }

    public StudentDTO getCurrentStudent() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        String name = authentication.getName();
        Student currentStudent = getStudentByUsername(name);
        return studentMapper.toStudentDTO(currentStudent);
    }

    public Student findStudentByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    public void updateStudent(StudentDTO studentDTO, String username) {
        Student student = getStudentByUsername(username);
        student.setName(studentDTO.getName());
        student.setEmail(studentDTO.getEmail());
        student.setPhone(studentDTO.getPhone());
        studentRepository.save(student);
    }
}
