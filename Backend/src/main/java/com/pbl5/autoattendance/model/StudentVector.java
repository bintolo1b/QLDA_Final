package com.pbl5.autoattendance.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
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
