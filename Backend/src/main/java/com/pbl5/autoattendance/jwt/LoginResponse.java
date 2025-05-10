package com.pbl5.autoattendance.jwt;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String jwtToken;
    private String refreshToken;
    private String username;
    private List<String> roles;
}
