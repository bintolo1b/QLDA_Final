package com.pbl5.autoattendance.api;

import com.pbl5.autoattendance.jwt.JwtUtils;
import com.pbl5.autoattendance.jwt.LoginRequest;
import com.pbl5.autoattendance.jwt.LoginResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class AuthenticationAPI {
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    public AuthenticationAPI(JwtUtils jwtUtils, AuthenticationManager authenticationManager) {
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest, HttpServletResponse httpServletResponse) {
        System.out.println("hi");
        Authentication authentication;
        try {
            authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (AuthenticationException exception) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", "Bad credentials");
            map.put("status", false);
            return new ResponseEntity<Object>(map, HttpStatus.NOT_FOUND);
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String accessToken = jwtUtils.generateTokenFromUsername(userDetails, "access");
        String refreshToken = jwtUtils.generateTokenFromUsername(userDetails, "refresh");

        jwtUtils.addCookie(httpServletResponse, "accessToken", accessToken, 60 * 60 * 24);
        jwtUtils.addCookie(httpServletResponse, "refreshToken", refreshToken, 60 * 60 * 24);
        System.out.println(refreshToken);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        LoginResponse response = new LoginResponse(accessToken, refreshToken, userDetails.getUsername(), roles);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response){
        jwtUtils.addCookie(response, "accessToken", "", 0);
        jwtUtils.addCookie(response, "refreshToken", "", 0);

        Map<String, Object> map = new HashMap<>();
        map.put("message", "Logout success");
        map.put("status", true);
        return new ResponseEntity<Object>(map, HttpStatus.OK);
    }
}
