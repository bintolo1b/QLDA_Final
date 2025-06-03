package com.pbl5.autoattendance.api;

import com.pbl5.autoattendance.dto.ApiResponse;
import com.pbl5.autoattendance.dto.AttendanceCheckDTO;
import com.pbl5.autoattendance.embedded.AttendanceCheckId;
import com.pbl5.autoattendance.model.AttendanceCheck;
import com.pbl5.autoattendance.model.Lesson;
import com.pbl5.autoattendance.service.AttendanceCheckService;
import com.pbl5.autoattendance.service.ClassService;
import com.pbl5.autoattendance.service.LessonService;
import com.pbl5.autoattendance.service.StudentService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/attendance")
public class AttendanceCheckAPI {
    AttendanceCheckService attendanceCheckService;
    LessonService lessonService;


    @PostMapping("/check")  
    public ResponseEntity<AttendanceCheckDTO> checkAttendance(@RequestBody Map<String, Object> request) {
        Integer lessonId = (Integer) request.get("lessonId");
        Integer studentId = (Integer) request.get("studentId");
        String image = (String) request.get("image");
        
        if (lessonId == null || studentId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        AttendanceCheckId id = new AttendanceCheckId();
        id.setLessonId(lessonId);
        id.setStudentId(studentId);
        
        AttendanceCheck attendanceCheck = attendanceCheckService.getAttendanceCheckById(id);
        
        if (attendanceCheck == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        attendanceCheck.setCheckinDate(LocalDateTime.now());
        attendanceCheck.setImgPath(image);
        Lesson lesson = lessonService.getLessonById(lessonId);

        if (LocalTime.now().isAfter(lesson.getStartTime().plusMinutes(10))) {
            attendanceCheck.setStatus("Late");
        } else {
            attendanceCheck.setStatus("Attended");
        }

        attendanceCheckService.saveAttendanceCheck(attendanceCheck);

        AttendanceCheckDTO dto = convertToDTO(attendanceCheck);
        
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }
    
    
    @PostMapping("/get_status")
    public ResponseEntity<AttendanceCheckDTO> getAttendanceCheck(@RequestBody Map<String, Integer> request) {
        Integer lessonId = request.get("lessonId");
        Integer studentId = request.get("studentId");
        if (lessonId == null || studentId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        // Cập nhật trạng thái điểm danh cho các buổi học đã kết thúc
        attendanceCheckService.updateExpiredAttendanceChecks();
        
        AttendanceCheckId id = new AttendanceCheckId();
        id.setLessonId(lessonId);
        id.setStudentId(studentId);
        
        AttendanceCheck attendanceCheck = attendanceCheckService.getAttendanceCheckById(id);
        
        if (attendanceCheck == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        AttendanceCheckDTO dto = convertToDTO(attendanceCheck);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @GetMapping("/result/{lessionId}")
    public ApiResponse<AttendanceCheckDTO> checkAttendent(@PathVariable int lessionId ){
        System.out.println("checkAttendent  code 1000");
        AttendanceCheckDTO result = attendanceCheckService.getAttendanceCheckByLessionid(lessionId);
        return ApiResponse.<AttendanceCheckDTO>builder()
                .code(1000)
                .result(result)
                .build();
    }

    @PostMapping("/update")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> updateCheckAttendance(@Valid @RequestBody AttendanceCheckDTO attendanceCheckDTO){
        System.out.println("updateCheckAttendance");
        AttendanceCheckId id = AttendanceCheckId.builder()
                .studentId(attendanceCheckDTO.getStudentId())
                .lessonId(attendanceCheckDTO.getLessonId())
                .build();
        AttendanceCheck attendanceCheck = attendanceCheckService.findById(id);
        if (attendanceCheck == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        attendanceCheck.setStatus(attendanceCheckDTO.getStatus());
        if (attendanceCheckDTO.getStatus().equals("Absent")){
            attendanceCheck.setImgPath("");
            attendanceCheck.setCheckinDate(null);
        }
        else{
            if (!attendanceCheckDTO.getImgPath().equals(""))
                attendanceCheck.setImgPath(attendanceCheckDTO.getImgPath());
            LocalDateTime checkinDate = attendanceCheckDTO.getCheckinDate();

            // Chuyển LocalDateTime thành ZonedDateTime (giả sử checkinDate là UTC)
            ZonedDateTime utcZonedDateTime = checkinDate.atZone(ZoneId.of("UTC"));

            // Chuyển từ UTC sang giờ Việt Nam (UTC+7)
            ZonedDateTime vietnamZonedDateTime = utcZonedDateTime.withZoneSameInstant(ZoneId.of("Asia/Ho_Chi_Minh"));

            attendanceCheck.setCheckinDate(vietnamZonedDateTime.toLocalDateTime());
        }

        attendanceCheckService.update(attendanceCheck);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //
    
    private AttendanceCheckDTO convertToDTO(AttendanceCheck attendanceCheck) {
        AttendanceCheckDTO dto = new AttendanceCheckDTO();
        dto.setCheckinDate(attendanceCheck.getCheckinDate());
        dto.setImgPath(attendanceCheck.getImgPath());
        dto.setLessonId(attendanceCheck.getLesson().getId());
        dto.setStudentId(attendanceCheck.getStudent().getId());
        dto.setStatus(attendanceCheck.getStatus());
        return dto;
    }


}
