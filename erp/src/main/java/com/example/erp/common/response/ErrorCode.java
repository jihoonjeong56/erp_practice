package com.example.erp.common.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    /*공통*/
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "C001","잘못된 입력값입니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "C002", "인증이 필요합니다."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "C003", "접근 권한이 없습니다."),

    /*유저*/
    DUPLICATE_USERNAME(HttpStatus.CONFLICT, "U001", "이미 사용 중인 아이디입니다."),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U002", "사용자를 찾을 수 없습니다."),
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "U003", "비밀번호가 일치하지 않습니다."),
    DUPLICATE_EMAIL(HttpStatus.CONFLICT ,"U004" ,"이미 사용중인 이메일 입니다." );

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;


}
