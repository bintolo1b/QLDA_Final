package com.pbl5.autoattendance.service;

import com.pbl5.autoattendance.dto.LessonDTO;
import com.pbl5.autoattendance.dto.LessonTimeRangeDTO;
import com.pbl5.autoattendance.model.Class;
import com.pbl5.autoattendance.model.Lesson;
import com.pbl5.autoattendance.model.Student;
import com.pbl5.autoattendance.model.StudentClass;
import com.pbl5.autoattendance.model.AttendanceCheck;
import com.pbl5.autoattendance.embedded.AttendanceCheckId;
import com.pbl5.autoattendance.repository.LessonRepository;
import com.pbl5.autoattendance.repository.ClassRepository;
import com.pbl5.autoattendance.repository.AttendanceCheckRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LessonService {
    private final LessonRepository lessonRepository;
    private final ClassRepository classRepository;
    private final AttendanceCheckRepository attendanceCheckRepository;

    public List<Lesson> getLessonsByClassIdBeforeDate(Integer classId) {
        return lessonRepository.findLessonBeforeDate(classId, LocalDate.now());
    }

    public Lesson getLessonById(int id) {
        return lessonRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lesson with ID " + id + " not found"));
    }

    public List<Lesson> createLessons(Map<String, LessonTimeRangeDTO> schedule, Class newClass, Integer numberOfWeeks) {
        return generateLessons(schedule, newClass, numberOfWeeks, true);
    }

    public List<Lesson> generateLessons(Map<String, LessonTimeRangeDTO> schedule, Class newClass, Integer numberOfWeeks, boolean saveToDb) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today;

        // Tạo danh sách để lưu tất cả các lesson
        List<Lesson> allLessons = new java.util.ArrayList<>();
        
        for (int week = 0; week < numberOfWeeks; week++) {
            for (Map.Entry<String, LessonTimeRangeDTO> entry : schedule.entrySet()) {
                String day = entry.getKey();
                DayOfWeek dayOfWeek = DayOfWeek.valueOf(day.toUpperCase());
                LessonTimeRangeDTO timeRange = entry.getValue();
                LocalTime startTime = timeRange.getStartTime();
                LocalTime endTime = timeRange.getEndTime();
                
                // Tính toán ngày của buổi học trong tuần hiện tại
                LocalDate lessonDate = startDate.plusWeeks(week);
                
                // Điều chỉnh ngày để khớp với ngày trong tuần
                int daysToAdd = (dayOfWeek.getValue() - lessonDate.getDayOfWeek().getValue());
                if (daysToAdd < 0) {
                    daysToAdd += 7;
                }
                lessonDate = lessonDate.plusDays(daysToAdd);
                
                // Tạo lesson mới
                Lesson newLesson = Lesson.builder()
                        .aClass(newClass)
                        .startTime(startTime)
                        .endTime(endTime)
                        .isCompleted(false)
                        .lessonDate(lessonDate)
                        .build();
                
                // Lưu lesson vào database nếu saveToDb = true
                if (saveToDb) {
                    lessonRepository.save(newLesson);
                }
                allLessons.add(newLesson);
            }
        }
        
        return allLessons;
    }

    public List<Lesson> getLessonsByClassId(Integer classId) {
        return lessonRepository.findByaClass_Id(classId);
    }

    @Transactional
    public Lesson createSingleLesson(LessonDTO lessonDTO) {
        Class aClass = classRepository.findById(lessonDTO.getClass_id())
            .orElseThrow(() -> new EntityNotFoundException("Class not found"));

        Lesson lesson = Lesson.builder()
            .aClass(aClass)
            .lessonDate(lessonDTO.getLessonDate())
            .startTime(lessonDTO.getStartTime())
            .endTime(lessonDTO.getEndTime())
            .room(lessonDTO.getRoom())
            .isCompleted(false)
            .notes(lessonDTO.getNotes())
            .attendanceChecks(new java.util.ArrayList<>())
            .build();

        lesson = lessonRepository.save(lesson);

        // Create AttendanceCheck for each student in the class
        for (StudentClass studentClass : aClass.getStudentClasses()) {
            Student student = studentClass.getStudent();
            AttendanceCheckId checkId = new AttendanceCheckId(lesson.getId(), student.getId());
            
            AttendanceCheck attendanceCheck = AttendanceCheck.builder()
                .id(checkId)
                .lesson(lesson)
                .student(student)
                .imgPath("")
                .status(null)
                .build();

            attendanceCheck = attendanceCheckRepository.save(attendanceCheck);
            lesson.getAttendanceChecks().add(attendanceCheck);
        }

        return lessonRepository.save(lesson);
    }

    @Transactional
    public void deleteLesson(Integer lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new EntityNotFoundException("Lesson not found"));

        // Check if lesson has already started
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lessonStart = lesson.getLessonDate().atTime(lesson.getStartTime());
        
        if (now.isAfter(lessonStart)) {
            throw new IllegalStateException("Cannot delete a lesson that has already started");
        }

        lessonRepository.delete(lesson);
    }
}
