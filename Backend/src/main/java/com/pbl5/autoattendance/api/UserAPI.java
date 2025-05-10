package com.pbl5.autoattendance.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserAPI {

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
}
