package com.pbl5.autoattendance.dto;

import com.pbl5.autoattendance.embedded.AttendanceCheckId;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AttendanceCheckDTO {
    @NotNull
    private Integer lessonId;
    @NotNull
    private Integer studentId;
    @NotNull
    private LocalDateTime checkinDate;

    @NotNull
    private String imgPath;

    @NotNull
    @NotBlank
    private String status;
}
