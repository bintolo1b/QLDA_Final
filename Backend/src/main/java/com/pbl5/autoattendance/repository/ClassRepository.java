package com.pbl5.autoattendance.repository;

import com.pbl5.autoattendance.model.Class;
import com.pbl5.autoattendance.model.Lesson;
import com.pbl5.autoattendance.model.Student;
import com.pbl5.autoattendance.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClassRepository extends JpaRepository<Class, Integer> {
    @Query("SELECT l.aClass FROM Lesson l WHERE l.id = :lessonId")
    Class findClassByLessonId(@Param("lessonId") int lessonId);

    List<Class> findByTeacher(Teacher teacher);


    List<Class> findByNameContainingIgnoreCase(String searchString);
}
