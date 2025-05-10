package com.pbl5.autoattendance.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentVector {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "feature_vector", columnDefinition = "json")
    private String featureVector;

    @OneToOne
    @JoinColumn(name = "student_id")
    private Student student;
}
