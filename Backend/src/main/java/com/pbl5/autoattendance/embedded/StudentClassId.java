package com.pbl5.autoattendance.embedded;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentClassId implements Serializable {
    private Integer studentId;
    private Integer classId;
}
