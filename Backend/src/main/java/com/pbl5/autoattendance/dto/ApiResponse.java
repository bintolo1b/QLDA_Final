package com.pbl5.autoattendance.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL) //cái nào null thì không trả về
public class ApiResponse<T> {
    private int code = 1000;
    private String message;
    private T result;


}
