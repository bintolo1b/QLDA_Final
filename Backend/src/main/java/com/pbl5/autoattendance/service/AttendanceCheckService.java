package com.pbl5.autoattendance.service;

import com.pbl5.autoattendance.dto.AttendanceCheckDTO;
import com.pbl5.autoattendance.embedded.AttendanceCheckId;
import com.pbl5.autoattendance.mapper.IAttendanceCheckMapper;
import com.pbl5.autoattendance.model.AttendanceCheck;
import com.pbl5.autoattendance.model.Class;
import com.pbl5.autoattendance.model.Lesson;
import com.pbl5.autoattendance.model.Student;
import com.pbl5.autoattendance.repository.AttendanceCheckRepository;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AttendanceCheckService {
    AttendanceCheckRepository attendanceCheckRepository;
    StudentService studentService;
    IAttendanceCheckMapper attendanceCheckMapper;


    public AttendanceCheckDTO getAttendanceCheckByLessionid(int lessionid) {
        return attendanceCheckMapper.toAttendanceCheckDTO(
                getAttendanceCheckById( AttendanceCheckId.builder()
                        .lessonId(lessionid)
                        .studentId(studentService.getCurrentStudent().getId())
                        .build()));
    }

    public AttendanceCheck getAttendanceCheckById(AttendanceCheckId id) {
        return attendanceCheckRepository.findById(id).orElse(null);
    }

    public AttendanceCheck saveAttendanceCheck(AttendanceCheck attendanceCheck) {
        return attendanceCheckRepository.save(attendanceCheck);
    }

    public void createAttendanceCheck(Student student, Class aclass) {
        List<Lesson> lessons = aclass.getLessons();
        for(Lesson lesson : lessons) {
            AttendanceCheckId id = AttendanceCheckId.builder()
                    .lessonId(lesson.getId())
                    .studentId(student.getId())
                    .build();
            AttendanceCheck attendanceCheck = AttendanceCheck.builder()
                    .id(id)
                    .checkinDate(null)
                    .status(null)
                    .imgPath("")
                    .lesson(lesson)
                    .student(student)
                    .build();
            attendanceCheckRepository.save(attendanceCheck);
        }
    }

    public void update(AttendanceCheck attendanceCheck) {
        attendanceCheckRepository.save(attendanceCheck);
    }

    public AttendanceCheck findById(AttendanceCheckId id) {
        return attendanceCheckRepository.findById(id).orElse(null);
    }
}
