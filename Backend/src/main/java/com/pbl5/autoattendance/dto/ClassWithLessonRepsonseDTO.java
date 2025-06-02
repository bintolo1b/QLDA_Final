package com.pbl5.autoattendance.dto;

import jakarta.validation.Valid;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Builder
@Getter
@Setter
public class ClassWithLessonRepsonseDTO {
    Integer classId;
    String name;
    Integer numberOfWeeks;
    private Map<String, @Valid LessonTimeRangeDTO> schedule;
    private String createdAt;
    private String teacherName;
    private Integer totalStudents;
}
