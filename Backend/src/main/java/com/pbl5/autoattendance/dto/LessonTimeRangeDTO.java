package com.pbl5.autoattendance.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class LessonTimeRangeDTO {
    @NotNull(message = "Thời gian bắt đầu không được để trống")
    private LocalTime startTime;

    @NotNull(message = "Thời gian kết thúc không được để trống")
    private LocalTime endTime;

    public void validateTimeRange() {
        if (startTime != null && endTime != null && startTime.isAfter(endTime)) {
            throw new IllegalArgumentException("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc");
        }
    }
}
