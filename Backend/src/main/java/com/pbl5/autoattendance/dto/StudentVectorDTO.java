package com.pbl5.autoattendance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class StudentVectorDTO {
    @NotNull(message = "Username không được để trống")
    @NotBlank(message = "Username không được để trống")
    private String username;

    @NotNull(message = "Feature vector không được để trống")
    private List<List<Double>> featureVector;
}
