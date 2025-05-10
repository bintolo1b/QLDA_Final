package com.pbl5.autoattendance.embedded;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
public class StudentAttendanceId implements Serializable {
    private Integer studentId;
    private Integer attendanceId;
}
