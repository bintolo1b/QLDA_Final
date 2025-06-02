package com.pbl5.autoattendance.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ClassDTO {
    private Integer id;

    private LocalDateTime createdAt;

    @NotNull
    @NotBlank
    private String name;

    @NotNull
    @Min(1)
    private Integer numberOfWeeks;

    private Integer teacherId;

    private boolean hideToTeacher;
}
