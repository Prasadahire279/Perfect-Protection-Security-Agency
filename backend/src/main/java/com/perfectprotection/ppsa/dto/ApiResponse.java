package com.perfectprotection.ppsa.dto;

import lombok.Data;
import java.util.Map;

@Data
public class ApiResponse {
    private boolean success;
    private String message;
    private Object data;

    public static ApiResponse ok(String message, Object data) {
        ApiResponse r = new ApiResponse();
        r.success = true;
        r.message = message;
        r.data = data;
        return r;
    }

    public static ApiResponse ok(Object data) {
        return ok("Success", data);
    }

    public static ApiResponse error(String message) {
        ApiResponse r = new ApiResponse();
        r.success = false;
        r.message = message;
        return r;
    }
}
