package com.pbl5.autoattendance.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RegisterDTO {
    @NotNull(message = "Username không được để trống")
    @NotBlank(message = "Username không được để trống")
    @Size(min = 3, max = 50, message = "Username phải có độ dài từ 3 đến 50 ký tự")
    private String username;

    @NotNull(message = "Password không được để trống")
    @NotBlank(message = "Password không được để trống")
    @Size(min = 6, message = "Password phải có ít nhất 6 ký tự")
    private String password;

    @NotNull(message = "Confirm password không được để trống")
    @NotBlank(message = "Confirm password không được để trống")
    private String confirmPassword;

    @NotEmpty(message = "Roles không được để trống")
    private List<String> roles;

    @NotNull(message = "Tên không được để trống")
    @NotBlank(message = "Tên không được để trống")
    private String name;

    @Pattern(regexp = "^[0-9]{10,11}$", message = "Số điện thoại không hợp lệ")
    private String phone;

    @Email(message = "Email không hợp lệ")
    private String email;
}



