package com.pbl5.autoattendance.model;

import com.pbl5.autoattendance.embedded.StudentClassId;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentClass {
    @EmbeddedId
    private StudentClassId id;

    @MapsId("studentId")
    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @MapsId("classId")
    @ManyToOne
    @JoinColumn(name = "class_id")
    private Class aClass;
}
