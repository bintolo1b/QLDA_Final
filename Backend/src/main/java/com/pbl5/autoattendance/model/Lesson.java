package com.pbl5.autoattendance.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import lombok.*;

@Entity
@Data
@NoArgsConstructor
@Setter
@Getter
@Builder
@AllArgsConstructor
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private Class aClass;

    @Column(nullable = false)
    private LocalDate lessonDate; // Ngày cụ thể của buổi học

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column
    private String room;

    @Column
    private Boolean isCompleted = false; // Trạng thái buổi học đã hoàn thành hay chưa

    @Column
    private String notes; // Ghi chú cho buổi học

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.REMOVE)
    private List<AttendanceCheck> attendanceChecks;

}