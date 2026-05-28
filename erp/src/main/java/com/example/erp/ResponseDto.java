package com.example.erp;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseDto<T> {
    private final boolean success;
    private final String message;
    private final T data;
    private final Instant timestamp;

    private final Integer status;
    private final String code;

    @Builder
    private ResponseDto(boolean success, String message, T data, Instant timestamp, Integer status, String code) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = timestamp;
        this.status = status;
        this.code = code;
    }

    public static <T> ResponseDto<T> success(String message, T data) {
        return ResponseDto.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .status(200)
                .timestamp(Instant.now())
                .build();
    }
    public static <T> ResponseDto<T> success(String message) {
        return ResponseDto.<T>builder()
                .success(true)
                .message(message)
                .status(200)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ResponseDto<T> success(T data) {
        return ResponseDto.<T>builder()
                .success(true)
                .message("success")
                .data(data)
                .status(200)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ResponseDto<T> failure(String message, Integer httpStatus, String code) {
        return ResponseDto.<T>builder()
                .success(false)
                .message(message)
                .status(httpStatus)
                .code(code)
                .timestamp(Instant.now())
                .build();
    }

}
