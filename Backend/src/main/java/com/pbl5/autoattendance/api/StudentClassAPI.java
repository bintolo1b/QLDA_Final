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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Student student = studentService.getStudentByUsername(username);
        Class aclass = classService.getClassById(classId);
        if (aclass == null)
            return new ResponseEntity<>("Class not found", HttpStatus.NOT_FOUND);

        if (studentClassService.checkScheduleConflict(student, aclass)){
            Map<String, String> errors = new HashMap<>();
            errors.put("message", "Conflict with old class");
            return new ResponseEntity<>(errors, HttpStatus.CONFLICT);
        }


        StudentClassId id = StudentClassId.builder().classId(aclass.getId()).studentId(student.getId()).build();
        StudentClass studentClass = StudentClass.builder()
                .id(id)
                .aClass(aclass)
                .student(student)
                .build();
        studentClassService.save(studentClass);

        attendanceCheckService.createAttendanceCheck(student, aclass);

        return new ResponseEntity<>(convertToStudentClassDTO(studentClass), HttpStatus.OK);
    }

    public StudentClassDTO convertToStudentClassDTO(StudentClass studentClassEntity){
        StudentClassDTO dto = new StudentClassDTO();
        dto.setClass_id(studentClassEntity.getId().getClassId());
        dto.setStudent_id(studentClassEntity.getStudent().getId());
        return dto;
    }
}
