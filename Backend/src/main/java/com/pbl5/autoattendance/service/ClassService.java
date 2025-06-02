package com.pbl5.autoattendance.service;

import com.pbl5.autoattendance.dto.ClassWithLessonRequestDTO;
import com.pbl5.autoattendance.dto.LessonTimeRangeDTO;
import com.pbl5.autoattendance.model.Class;
import com.pbl5.autoattendance.model.Student;
import com.pbl5.autoattendance.model.StudentClass;
import com.pbl5.autoattendance.model.Teacher;
import com.pbl5.autoattendance.model.Lesson;
import com.pbl5.autoattendance.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ClassService {
    ClassRepository classRepository;
    TeacherRepository teacherRepository;
    StudentClassRepository studentClassRepository;
    LessonRepository lessonRepository;
    private final StudentRepository studentRepository;

    public List<Class> getAllClasses() {
        return classRepository.findAll();
    }

    public Class getClassById(int id) {
        return classRepository.findById(id).orElse(null);
    }

    public Class getClassByLessonId(int lessonId) {
        return classRepository.findClassByLessonId(lessonId);
    }

    public Class createNewClass(ClassWithLessonRequestDTO classWithLessonDTO, Teacher teacher) {
        Class newClass = Class.builder()
                .createdAt(LocalDateTime.now())
                .name(classWithLessonDTO.getName())
                .numberOfWeeks(classWithLessonDTO.getNumberOfWeeks())
                .teacher(teacher)
                .build();
        return classRepository.save(newClass);
    }


    public List<Class> getAllClassesOfTeacher(Teacher teacher) {
        return classRepository.findByTeacher(teacher);
    }

    public List<Class> getAllClasessOfStudent(Student student) {
        return studentClassRepository.findByStudent(student)
                .stream()
                .map(StudentClass::getAClass)
                .collect(Collectors.toList());
    }

    public boolean checkScheduleConflict(Teacher teacher, ClassWithLessonRequestDTO newClassDTO) {
        // Lấy tất cả các lớp hiện có của giáo viên
        List<Class> existingClasses = classRepository.findByTeacher(teacher);
        
        // Lấy tất cả các buổi học của các lớp đó
        List<Lesson> existingLessons = new ArrayList<>();
        for (Class aClass : existingClasses) {
            existingLessons.addAll(lessonRepository.findByaClass(aClass));
        }

        // Kiểm tra từng buổi học trong lịch mới
        for (Map.Entry<String, LessonTimeRangeDTO> entry : newClassDTO.getSchedule().entrySet()) {
            DayOfWeek dayOfWeek = DayOfWeek.valueOf(entry.getKey().toUpperCase());
            LessonTimeRangeDTO newLessonTime = entry.getValue();
            
            // Kiểm tra trùng với các buổi học hiện có
            for (Lesson existingLesson : existingLessons) {
                if (existingLesson.getLessonDate().getDayOfWeek() == dayOfWeek) {
                    // Kiểm tra thời gian có trùng nhau không
                    if (isTimeOverlap(
                            existingLesson.getStartTime(), existingLesson.getEndTime(),
                            newLessonTime.getStartTime(), newLessonTime.getEndTime()
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

    public List<Class> searchClassesByString(String searchString, String username) {
        List<Class> classes = classRepository.findByNameContainingIgnoreCase(searchString);
        if (classes.isEmpty()) {
            return new ArrayList<>();
        }

        List<Class> returnList = new ArrayList<>();

        for(Class aclass:classes){
           if (aclass.getTeacher().getUser().getUsername().equals(username))
               returnList.add(aclass);
           if (aclass.getStudentClasses().stream()
                   .anyMatch(studentClass -> studentClass.getStudent().getUser().getUsername().equals(username))) {
               returnList.add(aclass);
           }
        }

        return returnList;
    }

    public Class saveClass(Class aclass) {
        return classRepository.save(aclass);
    }
}
