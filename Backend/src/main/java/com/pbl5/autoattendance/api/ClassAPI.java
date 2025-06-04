package com.pbl5.autoattendance.api;

import com.pbl5.autoattendance.dto.*;
import com.pbl5.autoattendance.model.*;
import com.pbl5.autoattendance.model.Class;
import com.pbl5.autoattendance.service.ClassService;
import com.pbl5.autoattendance.service.LessonService;
import com.pbl5.autoattendance.service.StudentService;
import com.pbl5.autoattendance.service.TeacherService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/classes")
public class ClassAPI {
    
    private final ClassService classService;
    private final TeacherService teacherService;
    private final LessonService lessonService;
    private final StudentService studentService;

    public ClassAPI(ClassService classService, TeacherService teacherService, LessonService lessonService, StudentService studentService) {
        this.classService = classService;
        this.teacherService = teacherService;
        this.lessonService = lessonService;
        this.studentService = studentService;
    }
    
    @GetMapping
    public ResponseEntity<List<ClassDTO>> getAllClasses() {
        List<Class> classes = classService.getAllClasses();
        List<ClassDTO> classDTOs = classes.stream()
                .map(this::convertToDTO)
                .toList();
        return new ResponseEntity<>(classDTOs, HttpStatus.OK);
    }
    
    @GetMapping("/{classId}/students")
    public ResponseEntity<List<StudentDTO>> getStudentsByClassId(@PathVariable Integer classId) {

        Class classEnt = classService.getClassById(classId);
        if (classEnt == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        List<StudentDTO> studentDTOs = classEnt.getStudentClasses().stream()
                .map(StudentClass::getStudent)
                .map(this::convertToStudentDTO)
                .collect(Collectors.toList());
        
        return new ResponseEntity<>(studentDTOs, HttpStatus.OK);
    }
    
    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<ClassDTO> getClassByLessonId(@PathVariable Integer lessonId) {
        Class classEntity = classService.getClassByLessonId(lessonId);
        if (classEntity == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        ClassDTO classDTO = convertToDTO(classEntity);
        return new ResponseEntity<>(classDTO, HttpStatus.OK);
    }

    @GetMapping("/student/my-classes")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getAllClassesOfStudent(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Student student = studentService.getStudentByUsername(username);

        if (student == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<ClassDTO> classes = classService.getAllClasessOfStudent(student)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new ResponseEntity<>(classes, HttpStatus.OK);
    }

    @GetMapping("/teacher/my-classes")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> getAllClassesOfTeacher(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Teacher teacher = teacherService.getTeacherByUsername(username);

        if (teacher == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<ClassDTO> classes = classService.getAllClassesOfTeacher(teacher)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(classes, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> createNewClass(@RequestBody @Valid ClassWithLessonRequestDTO classWithLessonDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Teacher teacher = teacherService.getTeacherByUsername(username);
        if (teacher == null){
            Map<String, String> errors = new HashMap<>();
            errors.put("message", "Teacher not found");
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        System.out.println("test create");
        // Kiểm tra thời gian bắt đầu và kết thúc của từng buổi học
        try {
            for (LessonTimeRangeDTO lessonTime : classWithLessonDTO.getSchedule().values()) {
                lessonTime.validateTimeRange();
            }
        } catch (IllegalArgumentException e) {
            Map<String, String> errors = new HashMap<>();
            errors.put("message", e.getMessage());
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        if (classService.checkScheduleConflict(teacher, classWithLessonDTO)){
            Map<String, String> errors = new HashMap<>();
            errors.put("message", "Schedule conflict");
            return new ResponseEntity<>(errors, HttpStatus.CONFLICT);
        }

        Class newClass = classService.createNewClass(classWithLessonDTO, teacher);
        List<Lesson> lessons = lessonService.createLessons(classWithLessonDTO.getSchedule(), newClass, newClass.getNumberOfWeeks());
        return new ResponseEntity<>(convertToDTO(newClass), HttpStatus.CREATED);
    }

    @GetMapping("/{classId}")
    public ResponseEntity<?> getClassById(@PathVariable Integer classId) {
        Class aclass = classService.getClassById(classId);
        if (aclass == null) {
            Map<String, String> message = new HashMap<>();
            message.put("message", "Class not found");
            return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
        }
        ClassDTO classDTO = convertToDTO(aclass);
        return new ResponseEntity<>(classDTO, HttpStatus.OK);
    }

    @GetMapping("/{classId}/with-schedule")
    public ResponseEntity<?> getClassWithLessonById(@PathVariable Integer classId) {
        Class aclass = classService.getClassById(classId);
        if (aclass == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<Lesson> allLessons = lessonService.getLessonsByClassId(classId);

        if (allLessons.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        allLessons.sort((l1, l2) -> l1.getLessonDate().compareTo(l2.getLessonDate()));

        LocalDate firstLessonDate = allLessons.get(0).getLessonDate();

        List<Lesson> firstWeekLessons = allLessons.stream()
                .filter(lesson -> lesson.getLessonDate().isBefore(firstLessonDate.plusDays(7)))
                .toList();

        Map<String, LessonTimeRangeDTO> schedule = new HashMap<>();
        for (Lesson lesson : firstWeekLessons) {
            String dayOfWeek = lesson.getLessonDate().getDayOfWeek().toString();
            LessonTimeRangeDTO timeRange = new LessonTimeRangeDTO();
            timeRange.setStartTime(lesson.getStartTime());
            timeRange.setEndTime(lesson.getEndTime());
            schedule.put(dayOfWeek, timeRange);
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        String formattedCreatedAt = aclass.getCreatedAt()
                .atZone(java.time.ZoneId.of("Asia/Ho_Chi_Minh"))
                .format(formatter);

        ClassWithLessonRepsonseDTO dto = ClassWithLessonRepsonseDTO.builder()
                .classId(aclass.getId())
                .name(aclass.getName())
                .numberOfWeeks(aclass.getNumberOfWeeks())
                .schedule(schedule)
                .createdAt(formattedCreatedAt)
                .teacherName(aclass.getTeacher().getName())
                .totalStudents(aclass.getStudentClasses().size())
                .build();
        
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchClassByString(@RequestParam("searchString") String searchString) {
        if (searchString == null){
            Map<String, String> errors = new HashMap<>();
            errors.put("message", "Search string cannot be null");
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Class> classes = classService.searchClassesByString(searchString ,username);
        if (classes.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<ClassDTO> classDTOs = classes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new ResponseEntity<>(classDTOs, HttpStatus.OK);
    }

    @PatchMapping("/updateHiddenToTeacher/{classId}")
    public ResponseEntity<?> updateClassHiddenStatus(@PathVariable Integer classId) {
        Class aclass = classService.getClassById(classId);
        if (aclass == null) {
            return new ResponseEntity<>("Class not found", HttpStatus.NOT_FOUND);
        }
        aclass.setHideToTeacher(!aclass.isHideToTeacher());
        classService.saveClass(aclass);
        return new ResponseEntity<>(convertToDTO(aclass), HttpStatus.OK );
    }

    @PatchMapping("/rename/{classId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> renameClass(@PathVariable Integer classId, @RequestBody Map<String, String> request) {
        String newName = request.get("newName");
        if (newName == null || newName.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "New name cannot be empty");
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Class aclass = classService.getClassById(classId);

        if (aclass == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Class not found");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }

        if (!username.equals(aclass.getTeacher().getUser().getUsername())) {
            return new ResponseEntity<>("You are not the teacher of this class", HttpStatus.FORBIDDEN);
        }

        aclass.setName(newName.trim());
        classService.saveClass(aclass);
        return new ResponseEntity<>(convertToDTO(aclass), HttpStatus.OK);
    }

    @GetMapping("/checkHiddenToTeacher/{classId}")
    public ResponseEntity<?> checkClassHiddenStatus(@PathVariable Integer classId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Class aclass = classService.getClassById(classId);

        if (aclass == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Class not found");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }

        if (!username.equals(aclass.getTeacher().getUser().getUsername())){
            return new ResponseEntity<>("You are not the teacher of this class", HttpStatus.FORBIDDEN);
        }


        Map<String, String> response = new HashMap<>();
        response.put("hide", aclass.isHideToTeacher()? "true" : "false");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    private StudentDTO convertToStudentDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setName(student.getName());
        dto.setPhone(student.getPhone());
        dto.setEmail(student.getEmail());
        if (student.getUser() != null) {
            dto.setUsername(student.getUser().getUsername());
        }
        return dto;
    }
    
    private ClassDTO convertToDTO(Class classEntity) {
        ClassDTO dto = new ClassDTO();
        dto.setId(classEntity.getId());
        dto.setCreatedAt(classEntity.getCreatedAt());
        dto.setNumberOfWeeks(classEntity.getNumberOfWeeks());
        dto.setName(classEntity.getName());
        dto.setHideToTeacher(classEntity.isHideToTeacher());
        if (classEntity.getTeacher() != null) {
            dto.setTeacherId(classEntity.getTeacher().getId());
        }
        return dto;
    }
}
