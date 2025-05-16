package com.pbl5.autoattendance.api;

import com.pbl5.autoattendance.dto.TeacherDTO;
import com.pbl5.autoattendance.model.Teacher;
import com.pbl5.autoattendance.service.TeacherService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher")
public class TeacherAPI {
    private final TeacherService teacherService;

    public TeacherAPI(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<TeacherDTO> getCurrentTeacher(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        TeacherDTO dto = convertToTeacherDTO(teacherService.getTeacherByUsername(username));
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('TEACHER')")
    @PutMapping
    public ResponseEntity<?> updateTeacher(@Valid @RequestBody TeacherDTO teacherDTO){
        Map<String, String> map = new HashMap<>();
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Teacher teacher = teacherService.findTeacherByEmail(teacherDTO.getEmail());
        if (teacher != null && !teacher.getUser().getUsername().equals(username)){
            map.put("message", "Email is already exist");
            return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
        }

        teacherService.updateTeacher(teacherDTO, username);
        map.put("message", "Update successfully");
        return new ResponseEntity<>(map, HttpStatus.OK);
    }

    @GetMapping("/{teacherId}")
    public ResponseEntity<TeacherDTO> getTeacherByClassId(@PathVariable("teacherId") Integer teacherId){
        Teacher teacher = teacherService.getTeacherById(teacherId);
        System.out.println(teacher.getName());
        return new ResponseEntity<>(convertToTeacherDTO(teacher), HttpStatus.OK);
    }

    private TeacherDTO convertToTeacherDTO(Teacher teacher){
        return TeacherDTO.builder()
                .id(teacher.getId())
                .name(teacher.getName())
                .phone(teacher.getPhone())
                .email(teacher.getEmail())
                .username(teacher.getUser().getUsername())
                .build();
    }
}