package com.pbl5.autoattendance.exception;

import com.pbl5.autoattendance.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationException(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Validation error");

        Map<String, String> response = new HashMap<>();
        response.put("message", errorMessage);

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(value = AppException.class)
    public ResponseEntity<ApiResponse> HandlingRunTimeException(AppException e){
        ErrorCode errorCode = e.getErrorCode();
        ApiResponse<String> apiReponse = new ApiResponse<String>();
        apiReponse.setMessage(errorCode.getMessage());
        apiReponse.setCode(errorCode.getCode());
        return ResponseEntity.
                status(errorCode.getHttpStatusCode())
                .body(apiReponse);
    }
}