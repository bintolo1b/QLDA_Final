package com.pbl5.autoattendance.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(length = 10)
    private String phone;

    @Column(unique = true)
    private String email;

    @OneToOne
    @JoinColumn(name = "username", nullable = false)
    private User user;


    @OneToMany(mappedBy = "student")
    private List<StudentClass> studentClasses;

    @OneToMany(mappedBy = "student")
    private List<AttendanceCheck> attendanceChecks;

}
