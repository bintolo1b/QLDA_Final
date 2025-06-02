package com.pbl5.autoattendance.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Class {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "number_of_weeks")
    private Integer numberOfWeeks;

    @Column(name = "hide_to_teacher", nullable = false)
    private boolean hideToTeacher = false;

    @OneToMany(mappedBy = "aClass")
    private List<StudentClass> studentClasses;

    @ManyToOne
    @JoinColumn(nullable = false, name = "teacher_id")
    private Teacher teacher;

    @OneToMany(mappedBy = "aClass")
    private List<Lesson> lessons;
}
