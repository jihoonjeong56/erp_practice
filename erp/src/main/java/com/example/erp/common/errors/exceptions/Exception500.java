package com.example.erp.common.errors.exceptions;

/**
 * 500 Internal Server Error
 */
public class Exception500 extends RuntimeException {
    public Exception500(String message) {
        super(message);
    }
}
