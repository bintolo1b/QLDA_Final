package com.pbl5.autoattendance.mapper;

import com.pbl5.autoattendance.dto.AttendanceCheckDTO;
import com.pbl5.autoattendance.embedded.AttendanceCheckId;
import com.pbl5.autoattendance.model.AttendanceCheck;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface IAttendanceCheckMapper {
    @Mapping(target = "lessonId", expression = "java(attendanceCheck.getId().getLessonId())")
    @Mapping(target = "studentId", expression = "java(attendanceCheck.getId().getStudentId())")
    AttendanceCheckDTO toAttendanceCheckDTO(AttendanceCheck attendanceCheck);
}
