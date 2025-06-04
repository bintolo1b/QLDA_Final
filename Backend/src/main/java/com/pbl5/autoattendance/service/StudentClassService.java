package com.pbl5.autoattendance.service;

import com.pbl5.autoattendance.model.StudentClass;
import com.pbl5.autoattendance.model.Student;
import com.pbl5.autoattendance.model.Class;
import com.pbl5.autoattendance.model.Lesson;
import com.pbl5.autoattendance.repository.StudentClassRepository;
import com.pbl5.autoattendance.repository.LessonRepository;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

@Service
public class StudentClassService {
    private final StudentClassRepository studentClassRepository;
    private final LessonRepository lessonRepository;

    public StudentClassService(StudentClassRepository studentClassRepository, LessonRepository lessonRepository) {
        this.studentClassRepository = studentClassRepository;
        this.lessonRepository = lessonRepository;
    }

    public void save(StudentClass studentClass) {
        studentClassRepository.save(studentClass);
    }

    public boolean checkScheduleConflict(Student student, Class newClass) {
        // Lấy tất cả các lớp hiện có của sinh viên
        List<StudentClass> existingStudentClasses = studentClassRepository.findByStudent(student);
        
        // Lấy tất cả các buổi học của các lớp hiện có
        List<Lesson> existingLessons = new ArrayList<>();
        for (StudentClass studentClass : existingStudentClasses) {
            existingLessons.addAll(lessonRepository.findByaClass(studentClass.getAClass()));
        }

        // Lấy tất cả các buổi học của lớp mới
        List<Lesson> newClassLessons = lessonRepository.findByaClass(newClass);

        // Kiểm tra từng buổi học của lớp mới với các buổi học hiện có
        for (Lesson newLesson : newClassLessons) {
            DayOfWeek newLessonDay = newLesson.getLessonDate().getDayOfWeek();
            LocalTime newStartTime = newLesson.getStartTime();
            LocalTime newEndTime = newLesson.getEndTime();

            for (Lesson existingLesson : existingLessons) {
                if (existingLesson.getLessonDate().getDayOfWeek() == newLessonDay) {
                    // Kiểm tra thời gian có trùng nhau không
                    if (isTimeOverlap(
                            existingLesson.getStartTime(), existingLesson.getEndTime(),
                            newStartTime, newEndTime
                    )) {
                        return true; // Có trùng lịch
                    }
                }
            }
        }

        return false; // Không trùng lịch
    }

    private boolean isTimeOverlap(LocalTime start1, LocalTime end1, LocalTime start2, LocalTime end2) {
        // Kiểm tra xem hai khoảng thời gian có giao nhau không
        return !start1.isAfter(end2) && !start2.isAfter(end1);
    }

    public StudentClass updateHiddenStatus(Student student, Class aclass) {
        StudentClass studentClass = studentClassRepository.findByStudentAndAClass(student, aclass);
        if (studentClass == null)
            return null;
        studentClass.setHide(!studentClass.isHide());
        return studentClassRepository.save(studentClass);
    }

    public StudentClass findByStudentAndAClass(Student student, Class aclass) {
        return studentClassRepository.findByStudentAndAClass(student, aclass);
    }

    public void delete(StudentClass studentClass) {
        studentClassRepository.delete(studentClass);
    }
}
