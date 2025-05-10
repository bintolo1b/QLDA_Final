package com.pbl5.autoattendance.jwt;

import com.pbl5.autoattendance.model.UserDetailsImpl;
import com.pbl5.autoattendance.service.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {
    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsServiceImpl;

    public AuthTokenFilter(JwtUtils jwtUtils, UserDetailsServiceImpl userDetailsServiceImpl) {
        this.jwtUtils = jwtUtils;
        this.userDetailsServiceImpl = userDetailsServiceImpl;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
//        System.out.println("AuthTokenFilter called for URI: " + request.getRequestURI());
        try {
            String accessToken = jwtUtils.parseAccessTokenFromCookies(request);
//            System.out.println("access token in cookie "+ accessToken);

            if (accessToken != null && jwtUtils.validateJwtToken(accessToken)) {
                processValidAccessToken(request, accessToken);
            } else {
                processRefreshToken(request, response);
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e);
        }

        filterChain.doFilter(request, response);
    }

    private void processValidAccessToken(HttpServletRequest request, String accessToken) {
        String username = jwtUtils.getUserNameFromJwtToken(accessToken);
        UserDetailsImpl userDetailsImpl = userDetailsServiceImpl.loadUserByUsername(username);
        setAuthentication(request, userDetailsImpl);
    }

    private void processRefreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = jwtUtils.parseRefreshTokenFromCookies(request);
        System.out.println("refresh token in cookie "+ refreshToken);

        if (refreshToken != null && jwtUtils.validateJwtToken(refreshToken)) {
            String username = jwtUtils.getUserNameFromJwtToken(refreshToken);
            UserDetailsImpl userDetailsImpl = userDetailsServiceImpl.loadUserByUsername(username);
            setAuthentication(request, userDetailsImpl);

            String newAccessToken = jwtUtils.generateTokenFromUsername(userDetailsImpl, "access");
            String newRefreshToken = jwtUtils.generateTokenFromUsername(userDetailsImpl, "refresh");

            jwtUtils.addCookie(response, "accessToken", newAccessToken, 60 * 60 * 24);
            jwtUtils.addCookie(response, "refreshToken", newRefreshToken, 60 * 60 * 24 * 7);
        }
    }

    private void setAuthentication(HttpServletRequest request, UserDetailsImpl userDetailsImpl) {
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetailsImpl,
                        null,
                        userDetailsImpl.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}