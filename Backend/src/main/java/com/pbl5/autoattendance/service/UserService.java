package com.pbl5.autoattendance.service;

import com.pbl5.autoattendance.dto.RegisterDTO;
import com.pbl5.autoattendance.embedded.AuthorityId;
import com.pbl5.autoattendance.model.Authority;
import com.pbl5.autoattendance.model.Student;
import com.pbl5.autoattendance.model.Teacher;
import com.pbl5.autoattendance.model.User;
import com.pbl5.autoattendance.repository.AuthorityRepository;
import com.pbl5.autoattendance.repository.UserRepository;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthorityService authorityService;
    private final StudentService studentService;
    private final TeacherService teacherService;


    public ResponseEntity<Map<String, Object>> createNewUser(RegisterDTO registerDTO) {
        String message = "New user created!";
        Map<String, Object> response = new HashMap<>();
        System.out.println("here");
        if (userRepository.existsByUsername(registerDTO.getUsername()) ) {
            message = "Username is already exist";
            response.put("message", message);
            response.put("status", "failure");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        else if (!registerDTO.getPassword().equals(registerDTO.getConfirmPassword())) {
            message = "Passwords do not match";
            response.put("message", message);
            response.put("status", "failure");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        List<String> authorities = registerDTO.getRoles();
        boolean isStudent = authorities.contains("ROLE_STUDENT");
        boolean isTeacher = authorities.contains("ROLE_TEACHER");

        if (isStudent && isTeacher) {
            message = "User cannot be student and teacher at the same time";
            response.put("message", message);
            response.put("status", "failure");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        if (isTeacher && teacherService.findTeacherByEmail(registerDTO.getEmail()) != null) {
            message = "Email is already exist";
            response.put("message", message);
            response.put("status", "failure");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        if (isStudent && studentService.findByEmail(registerDTO.getEmail()) != null) {
            message = "Email is already exist";
            response.put("message", message);
            response.put("status", "failure");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        User newUser = User.builder()
                .username(registerDTO.getUsername())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .enabled(true)
                .build();
        userRepository.save(newUser);

        for (String authorityItem : authorities) {
                AuthorityId authorityId = AuthorityId.builder()
                    .username(registerDTO.getUsername())
                    .authority(authorityItem)
                    .build();

            Authority authority = Authority.builder()
                    .id(authorityId)
                    .user(newUser)
                    .build();
            authorityService.saveAuthority(authority);
        }

        if (isStudent) {
            Student student = Student.builder()
                    .name(registerDTO.getName())
                    .phone(registerDTO.getPhone())
                    .email(registerDTO.getEmail())
                    .user(newUser)
                    .build();
            studentService.saveStudent(student);
        } else if (isTeacher) {
            Teacher teacher = Teacher.builder()
                    .name(registerDTO.getName())
                    .phone(registerDTO.getPhone())
                    .email(registerDTO.getEmail())
                    .user(newUser)
                    .build();
            teacherService.saveTeacher(teacher);
        }

        message = "User created successfully!";
        response.put("message", message);
        response.put("status", "success");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean checkCurrentPassword(String username, String currentPassword) {
        User user = getUserByUsername(username);
        if (user == null) {
            return false;
        }
        return passwordEncoder.matches(currentPassword, user.getPassword());
    }

    public boolean updatePassword(String username, String newPassword) {
        User user = getUserByUsername(username);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }
}
