package com.example.erp.common.errors;


import com.example.erp.common.errors.exceptions.Exception400;
import com.example.erp.common.errors.exceptions.Exception401;
import com.example.erp.common.errors.exceptions.Exception403;
import com.example.erp.common.errors.exceptions.Exception404;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
@Slf4j
public class MyExceptionHandler {

    @ExceptionHandler(Exception400.class)
    public Object ex400(Exception400 e, Model model, HttpServletRequest request) {
        String message = e.getMessage();

        String accept =  request.getHeader("Accept");
        if(accept != null && accept.contains("application/json")) {
            log.debug("API 요청 에러 발생: {}", e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        model.addAttribute("alertMessage", e.getMessage());
        return "alert";
    }
    @ExceptionHandler(Exception401.class)
    public String ex401(Exception401 e, Model model) {
        model.addAttribute("alertMessage", e.getMessage());
        model.addAttribute("url", "/user/login");
        return "alert";
    }

    @ExceptionHandler(Exception403.class)
    public String ex403(Exception403 e, Model model) {
        model.addAttribute("alertMessage", e.getMessage());
        return "alert"; // history.back()
    }

    @ExceptionHandler(Exception404.class)
    public String ex404(Exception404 e, Model model) {
        model.addAttribute("alertMessage", e.getMessage());
        return "alert";
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public String handleDataViolationException(DataIntegrityViolationException e, Model model) {
        String errorMessage = e.getMessage();
        String displayMsg = "데이터베이스 오류가 발생했습니다.";

        if(errorMessage != null && errorMessage.contains("FOREIGN KEY")) {
            displayMsg = "관련된 데이터가 존재하여 삭제하거나 수정할 수 없습니다.";
        }

        model.addAttribute("alertMessage", displayMsg);
        return "alert";
    }

    @ExceptionHandler(RuntimeException.class)
    public String handleRuntimeException(RuntimeException e, Model model) {
        log.error("예상치 못한 에러: {}", e.getMessage());
        model.addAttribute("alertMessage", "서버 내부 오류가 발생했습니다: " + e.getMessage());
        return "alert";
    }
}
