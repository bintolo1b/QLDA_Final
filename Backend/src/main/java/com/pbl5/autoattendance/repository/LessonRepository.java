package com.pbl5.autoattendance.repository;

import com.pbl5.autoattendance.model.Class;
import com.pbl5.autoattendance.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Integer> {

    @Query("SELECT l FROM Lesson l WHERE l.aClass.id = :classId AND l.lessonDate <= :currentDate order by l.lessonDate desc ")
    List<Lesson> findLessonBeforeDate(@Param("classId") Integer classId, @Param("currentDate") LocalDate currentDate);

    List<Lesson> findByaClass_Id(Integer aClassId);

    @Query("SELECT l FROM Lesson l JOIN l.attendanceChecks ac WHERE ac.student.id = :studentId")
    List<Lesson> findLessonsByStudentId(Integer studentId);

    List<Lesson> findByaClass(Class aClass);
}
