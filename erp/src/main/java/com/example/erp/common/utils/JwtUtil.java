package com.example.erp.common.utils;

import lombok.Value;

public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;
}
