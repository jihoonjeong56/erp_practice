package com.example.erp.common.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    /*공통*/
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "C001", "잘못된 입력값입니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "C002", "인증이 필요합니다."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "C003", "접근 권한이 없습니다."),
    CODE_GROUP_NOT_FOUNT(HttpStatus.NOT_FOUND, "CC001", "코드그룹을 사용할 수 없습니다."),
    DUPLICATE_CODE_CROUP(HttpStatus.CONFLICT, "CC002", "이미 사용중인 코드 그룹입니다"),
    COMMON_CODE_NOT_FOUNT(HttpStatus.NOT_FOUND, "CC003", "공콩 코드를 찾을 수 없습니다."),
    DUPLICATE_COMMON_CODE(HttpStatus.CONFLICT, "CC004", "이미 사용 중인 코드 입니다."),

    /*유저*/
    DUPLICATE_USERNAME(HttpStatus.CONFLICT, "U001", "이미 사용 중인 아이디입니다."),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U002", "사용자를 찾을 수 없습니다."),
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "U003", "비밀번호가 일치하지 않습니다."),
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "U004", "이미 사용중인 이메일 입니다."),

    /*부서*/
    DEPARTMENT_NOT_FOUNT(HttpStatus.NOT_FOUND, "D001", "부서를 찾을수 없습니다."),
    DUPLICATE_DEPT_CODE(HttpStatus.CONFLICT, "D002", "이미 사용중인 부서 코드입니다."),
    CANNOT_DELETE_DEPARTMENT(HttpStatus.BAD_REQUEST, "D003", "하위부서가 있어 삭제할 수 없습니다."),

    /*직급*/
    POSITION_NOT_FOUND(HttpStatus.NOT_FOUND, "P001", "직급을 찾을 수 없습니다."),
    DUPLICATE_POSITION_CODE(HttpStatus.CONFLICT, "P002", "이미 사용 중인 직급 코드입니다."),
    CANNOT_DELETE_POSITION(HttpStatus.BAD_REQUEST, "P003", "해당 직급을 사용중인 직원이 있어 삭제할 수 없습니다."),

    /*직급*/
    EMPLOYEE_NOT_FOUND(HttpStatus.NOT_FOUND, "E001", "직원을 찾을 수 없습니다."),
    DUPLICATE_EMP_NO(HttpStatus.CONFLICT, "E002", "이미 사용 중인 사원 번호 입니다."),
    DUPLICATE_EMPLOYEE_EMAIL(HttpStatus.BAD_REQUEST, "E003", "이미 사용중인 이메일입니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;


}
