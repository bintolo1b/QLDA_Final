package com.pbl5.autoattendance.model;

import com.pbl5.autoattendance.embedded.AttendanceCheckId;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceCheck {
    @EmbeddedId
    private AttendanceCheckId id;

    @Column
    private LocalDateTime checkinDate;

    @Column(nullable = false)
    private String imgPath;

    @MapsId("lessonId")
    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @MapsId("studentId")
    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @Column(length = 15)
    private String status;
}
