package com.pbl5.autoattendance.api;
import com.pbl5.autoattendance.dto.RegisterDTO;
import com.pbl5.autoattendance.model.Student;
import com.pbl5.autoattendance.model.User;
import com.pbl5.autoattendance.model.Authority;
import com.pbl5.autoattendance.embedded.AuthorityId;
import com.pbl5.autoattendance.repository.StudentRepository;
import com.pbl5.autoattendance.repository.UserRepository;
import com.pbl5.autoattendance.repository.AuthorityRepository;
import com.pbl5.autoattendance.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/register")
@RequiredArgsConstructor
@Validated
public class RegisterAPI {
    private final UserService userService;


    @PostMapping
    public ResponseEntity<?> register(@RequestBody @Valid RegisterDTO registerDTO) {
        return userService.createNewUser(registerDTO);
    }
}
