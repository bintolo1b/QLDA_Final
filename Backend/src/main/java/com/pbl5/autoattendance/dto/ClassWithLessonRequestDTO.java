package com.pbl5.autoattendance.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
public class ClassWithLessonRequestDTO {
    @NotNull(message = "Tên lớp không được để trống")
    @NotBlank(message = "Tên lớp không được để trống")
    String name;

    @NotNull(message = "Số tuần không được để trống")
    @Min(value = 1, message = "Số tuần phải lớn hơn 0")
    Integer numberOfWeeks;

    @Valid
    private Map<String, @Valid LessonTimeRangeDTO> schedule;
}
