package com.pbl5.autoattendance.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    DOB_INVALID(1005, "Your age must be at least {min} years old and under {max} years old", HttpStatus.BAD_REQUEST),
    DOB_NULL(1006, "Your age must not be null", HttpStatus.BAD_REQUEST),
    UNKNOWN_ERROR(9999, "Unknown error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(9998, "Invalid message key", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1001, "User existed", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    STUDENT_NOT_EXISTED(1005, "Student not existed", HttpStatus.NOT_FOUND),
    USER_NOT_FOUND(1002, "User not found", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    USERNAME_INVALID(1003, "Username must be at least {min} characters long", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1004, "Password must be at least {min} characters long", HttpStatus.BAD_REQUEST),
    ACCESS_DENIED(1005, "Access denied", HttpStatus.FORBIDDEN),;

    private int code;
    private String message;
    private HttpStatusCode httpStatusCode;

     ErrorCode(int code, String message, HttpStatusCode httpStatusCode) {
        this.code = code;
        this.message = message;
        this.httpStatusCode = httpStatusCode;
    }

}
