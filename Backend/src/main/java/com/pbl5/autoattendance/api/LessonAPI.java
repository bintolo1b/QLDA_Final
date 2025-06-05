package com.pbl5.autoattendance.api;

import com.pbl5.autoattendance.dto.LessonDTO;
import com.pbl5.autoattendance.dto.ScheduleDTO;
import com.pbl5.autoattendance.model.Lesson;
import com.pbl5.autoattendance.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/lessons")
public class LessonAPI {
    
    private final LessonService lessonService;

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<LessonDTO>> getLessonsByClassId(@PathVariable Integer classId) {
        List<Lesson> lessons = lessonService.getLessonsByClassId(classId);
        List<LessonDTO> lessonDTODTOS = lessons.stream()
                .map(this::convertToDTO)
                .toList();
        return ResponseEntity.ok(lessonDTODTOS);
    }
    
    @GetMapping("/{lessonId}")
    public ResponseEntity<LessonDTO> getLessonById(@PathVariable Integer lessonId) {
        Lesson lesson = lessonService.getLessonById(lessonId);
        if (lesson == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        LessonDTO lessonDTO = convertToDTO(lesson);
        return ResponseEntity.ok(lessonDTO);
    }

    @GetMapping("/schedule/{classId}")
    public ResponseEntity<?> getLessonByClassId(@PathVariable Integer classId){
        List<Lesson> lessons = lessonService.getLessonsByClassId(classId);
        List<LessonDTO> lessonDTO = lessons.stream()
                .map(this::convertToDTO)
                .toList();
        Set<DayOfWeek> seenDays = new HashSet<>();
        List<ScheduleDTO> scheduleDTOS = lessonDTO.stream()
                .map(this::convertToScheduleDTO)
                .filter(dto -> seenDays.add(dto.getDayOfWeek()))
                .sorted(Comparator.comparingInt(dto -> dto.getDayOfWeek().getValue()))
                .toList();
        return ResponseEntity.ok(scheduleDTOS);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> createLesson(@RequestBody LessonDTO lessonDTO) {
        System.out.println("cr");
        Map<String, Object> result = lessonService.createSingleLesson(lessonDTO);
        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(convertToDTO((Lesson) result.get("data")));
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @DeleteMapping("/{lessonId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> deleteLesson(@PathVariable Integer lessonId) {
        try {
            lessonService.deleteLesson(lessonId);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private LessonDTO convertToDTO(Lesson lesson) {
        LessonDTO dto = new LessonDTO();
        dto.setId(lesson.getId());
        dto.setClass_id(lesson.getAClass().getId());
        dto.setLessonDate(lesson.getLessonDate());
        dto.setStartTime(lesson.getStartTime());
        dto.setEndTime(lesson.getEndTime());
        dto.setRoom(lesson.getRoom());
        dto.setIsCompleted(lesson.getIsCompleted());
        dto.setNotes(lesson.getNotes());
        return dto;
    }

    private ScheduleDTO convertToScheduleDTO(LessonDTO lesson) {
        ScheduleDTO dto = new ScheduleDTO();
        dto.setDayOfWeek(convertDateToDayOfWeek(lesson.getLessonDate()));
        dto.setStartTime(lesson.getStartTime());
        dto.setEndTime(lesson.getEndTime());
        return dto;
    }

    private DayOfWeek convertDateToDayOfWeek(LocalDate date){
        return date.getDayOfWeek();
    }
}
