package com.pbl5.autoattendance.mapper;

import com.pbl5.autoattendance.dto.StudentDTO;
import com.pbl5.autoattendance.model.Student;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface IStudentMapper {
    Student toStudent(StudentDTO studentDTO);
    @Mapping(target = "username", source = "user.username")
    StudentDTO toStudentDTO(Student student);
}
