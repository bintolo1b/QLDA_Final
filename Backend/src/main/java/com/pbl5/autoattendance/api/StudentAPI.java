package com.pbl5.autoattendance.api;

import com.pbl5.autoattendance.dto.ApiResponse;
import com.pbl5.autoattendance.dto.StudentDTO;
import com.pbl5.autoattendance.dto.TeacherDTO;
import com.pbl5.autoattendance.mapper.IStudentMapper;
import com.pbl5.autoattendance.model.Student;
import com.pbl5.autoattendance.model.Teacher;
import com.pbl5.autoattendance.service.StudentService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/student")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StudentAPI {
    StudentService studentService;

    @GetMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<StudentDTO> getCurrentStudent(){
        StudentDTO result = studentService.getCurrentStudent();
        return ApiResponse.<StudentDTO>builder()
                .code(1000)
                .result(result)
                .build();
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PutMapping
    public ResponseEntity<?> updateStudent(@Valid @RequestBody StudentDTO studentDTO){
        Map<String, String> map = new HashMap<>();
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Student student = studentService.findStudentByEmail(studentDTO.getEmail());
        if (student != null && !student.getUser().getUsername().equals(username)){
            map.put("message", "Email is already exist");
            return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
        }

        studentService.updateStudent(studentDTO, username);
        map.put("message", "Update successfully");
        return new ResponseEntity<>(map, HttpStatus.OK);
    }
}
