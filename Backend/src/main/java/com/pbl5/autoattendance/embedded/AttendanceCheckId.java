package com.pbl5.autoattendance.embedded;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceCheckId implements Serializable {
    private Integer studentId;
    private Integer lessonId;


}
