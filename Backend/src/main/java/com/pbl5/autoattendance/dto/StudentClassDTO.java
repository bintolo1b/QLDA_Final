package com.pbl5.autoattendance.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentClassDTO {
    private Integer class_id;
    private Integer student_id;
    private boolean hide;
}
