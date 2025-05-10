package com.pbl5.autoattendance.api;

import org.apache.commons.io.FilenameUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/avatars")
public class Avatar {

    private static final String[] ALLOWED_EXTENSIONS = { "jpg", "jpeg", "png" };

    @PostMapping
    public ResponseEntity<?> upLoadAvt(@RequestParam("file") MultipartFile file) {
        Map<String, String> map = new HashMap<>();
        try {
            // Lấy tên file gốc và phần mở rộng (đuôi file)
            String originalFilename = file.getOriginalFilename();
            String fileExtension = FilenameUtils.getExtension(originalFilename).toLowerCase();

            // Kiểm tra xem file có phải là jpg hoặc png không
            boolean isValidExtension = false;
            for (String ext : ALLOWED_EXTENSIONS) {
                if (fileExtension.equals(ext)) {
                    isValidExtension = true;
                    break;
                }
            }

            if (!isValidExtension) {
                map.put("message", "Only JPG and PNG files are allowed");
                return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
            }

            // Nếu file hợp lệ, ép về định dạng jpg
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            String filePath = Paths.get(System.getProperty("user.dir"), "uploads", "avatars", username + ".jpg").toString();

            // Lưu file
            file.transferTo(new File(filePath));

        } catch (Exception e) {
            e.printStackTrace();
            map.put("message", "Error when uploading img");
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        map.put("message", "Upload successfully");
        return new ResponseEntity<>(map, HttpStatus.CREATED);
    }
}