package com.pbl5.autoattendance.service;

import com.pbl5.autoattendance.model.Student;
import com.pbl5.autoattendance.model.StudentVector;
import com.pbl5.autoattendance.repository.StudentVectorRepository;
import org.springframework.stereotype.Service;

@Service
public class StudentVectorService {
    private final StudentVectorRepository studentVectorRepository;

    public StudentVectorService(StudentVectorRepository studentVectorRepository) {
        this.studentVectorRepository = studentVectorRepository;
    }

    public void save(StudentVector studentVector) {
        studentVectorRepository.save(studentVector);
    }

    public StudentVector findByStudent(Student student) {
        return studentVectorRepository.findByStudent(student);
    }
}
