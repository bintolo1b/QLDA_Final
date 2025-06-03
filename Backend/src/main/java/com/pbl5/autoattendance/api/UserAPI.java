package com.pbl5.autoattendance.api;

import com.pbl5.autoattendance.dto.ChangePasswordDTO;
import com.pbl5.autoattendance.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserAPI {
    private final UserService userService;

    public UserAPI(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/avatar")
    public ResponseEntity<?> getCurrentUserAvtPath(){
        Map<String, String> map = new HashMap<>();
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String filePath = Paths.get(System.getProperty("user.dir"), "uploads", "avatars", username + ".jpg").toString();

        File file = new File(filePath);
        if (file.exists()){
            map.put("Path", "/avatars/"+username+".jpg");
            return new ResponseEntity<>(map, HttpStatus.OK);
        }
        else {
            map.put("Message", "Not found");
            return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
        }

    }

    @PatchMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestBody @Valid ChangePasswordDTO changePasswordDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        if (!userService.checkCurrentPassword(username, changePasswordDTO.getCurrentPassword())) {
            Map<String, String> errors = new HashMap<>();
            errors.put("message", "Current password is incorrect");
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        if (!changePasswordDTO.getNewPassword().equals(changePasswordDTO.getConfirmPassword())) {
            Map<String, String> errors = new HashMap<>();
            errors.put("message", "New password and confirm password do not match");
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        boolean isUpdated = userService.updatePassword(username, changePasswordDTO.getNewPassword());

        if (isUpdated) {
            return new ResponseEntity<>("Password updated successfully", HttpStatus.OK);
        } else {
            Map<String, String> errors = new HashMap<>();
            errors.put("message", "Failed to update password");
            return new ResponseEntity<>(errors, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
