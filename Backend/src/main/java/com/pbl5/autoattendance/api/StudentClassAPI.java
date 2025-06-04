package com.pbl5.autoattendance.api;

import com.pbl5.autoattendance.dto.StudentClassDTO;
import com.pbl5.autoattendance.embedded.StudentClassId;
import com.pbl5.autoattendance.model.Class;
import com.pbl5.autoattendance.model.Student;
import com.pbl5.autoattendance.model.StudentClass;
import com.pbl5.autoattendance.service.AttendanceCheckService;
import com.pbl5.autoattendance.service.ClassService;
import com.pbl5.autoattendance.service.StudentClassService;
import com.pbl5.autoattendance.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/student-class")
public class StudentClassAPI {
    private final StudentClassService studentClassService;
    private final StudentService studentService;
    private final ClassService classService;
    private final AttendanceCheckService attendanceCheckService;


    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/join/{classId}")
    public ResponseEntity<?> joinClass(@PathVariable Integer classId) {
        System.out.println("join class");
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Student student = studentService.getStudentByUsername(username);
        Class aclass = classService.getClassById(classId);
        if (aclass == null) {
            return new ResponseEntity<>("Class not found", HttpStatus.NOT_FOUND);
        }

        if (studentClassService.checkScheduleConflict(student, aclass)) {
            Map<String, String> errors = new HashMap<>();
            errors.put("message", "Conflict with old class");
            return new ResponseEntity<>(errors, HttpStatus.CONFLICT);
        }

        StudentClassId id = new StudentClassId(student.getId(), aclass.getId());
        StudentClass studentClass = StudentClass.builder()
                .id(id)
                .aClass(aclass)
                .student(student)
                .build();
        studentClassService.save(studentClass);
        attendanceCheckService.createAttendanceCheck(student, aclass);

        return new ResponseEntity<>(convertToStudentClassDTO(studentClass), HttpStatus.OK);
    }

    @PatchMapping("/updateHidden/{classId}")
    public ResponseEntity<?> updateClassHiddenStatus(@PathVariable Integer classId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Student student = studentService.getStudentByUsername(username);
        Class aclass = classService.getClassById(classId);
        if (aclass == null) {
            return new ResponseEntity<>("Class not found", HttpStatus.NOT_FOUND);
        }
        StudentClass studentClass =  studentClassService.updateHiddenStatus(student, aclass);
        if (studentClass == null) {
            return new ResponseEntity<>("Student is not enrolled in this class", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(convertToStudentClassDTO(studentClass), HttpStatus.OK);
    }

    @GetMapping("/checkHidden/{classId}")
    public ResponseEntity<?> checkClassHiddenStatus(@PathVariable Integer classId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Student student = studentService.getStudentByUsername(username);

        if (student == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Student not found");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }

        Class aclass = classService.getClassById(classId);
        if (aclass == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Class not found");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }

        StudentClass studentClass = studentClassService.findByStudentAndAClass(student, aclass);
        if (studentClass == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Student is not enrolled in this class");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }

        Map<String, String> response = new HashMap<>();
        response.put("hide", studentClass.isHide() ? "true" : "false");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('STUDENT')")
    @DeleteMapping("/quit/{classId}")
    public ResponseEntity<?> quitClass(@PathVariable Integer classId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Student student = studentService.getStudentByUsername(username);
        
        if (student == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Student not found");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }

        Class aclass = classService.getClassById(classId);
        if (aclass == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Class not found");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }

        StudentClass studentClass = studentClassService.findByStudentAndAClass(student, aclass);
        if (studentClass == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Student is not enrolled in this class");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }

        
        // Delete student class record
        studentClassService.delete(studentClass);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Successfully quit the class");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public StudentClassDTO convertToStudentClassDTO(StudentClass studentClassEntity){
        StudentClassDTO dto = new StudentClassDTO();
        dto.setClass_id(studentClassEntity.getId().getClassId());
        dto.setStudent_id(studentClassEntity.getStudent().getId());
        dto.setHide(studentClassEntity.isHide());
        return dto;
    }
}
