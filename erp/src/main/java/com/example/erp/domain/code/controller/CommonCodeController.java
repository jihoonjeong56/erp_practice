package com.example.erp.domain.code.controller;

import com.example.erp.common.response.ApiResponse;
import com.example.erp.domain.code.dto.CodeGroupCreateRequest;
import com.example.erp.domain.code.dto.CodeGroupResponse;
import com.example.erp.domain.code.dto.CommonCodeCreateRequest;
import com.example.erp.domain.code.dto.CommonCodeResponse;
import com.example.erp.domain.code.service.CommonCodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/codes")
@RequiredArgsConstructor
public class CommonCodeController {
    private final CommonCodeService commonCodeService;

    @PostMapping("/groups")
    public ResponseEntity<ApiResponse<String>> createGroup(
            @Valid @RequestBody CodeGroupCreateRequest request
            ){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(commonCodeService.createGroup(request)));
    }

    @GetMapping("/groups")
    public ResponseEntity<ApiResponse<List<CodeGroupResponse>>> getAllGroups(){
        return ResponseEntity.ok(ApiResponse.ok(commonCodeService.getAllGroups()));
    }

    @GetMapping("/groups/{groupCode}")
    public ResponseEntity<ApiResponse<CodeGroupResponse>> getGroup(
            @PathVariable String groupCode
    ){
        return ResponseEntity.ok(ApiResponse.ok(commonCodeService.getGroup(groupCode)));
    }

//    ----------------------------------------------------------------------------------
    
    @PostMapping("/groups/{groupCode}/codes")
    public ResponseEntity<ApiResponse<Long>> createCode(
            @PathVariable String groupCode,
            @Valid @RequestBody CommonCodeCreateRequest request
            ){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(commonCodeService.createCode(groupCode, request)));
    }

    @GetMapping("/groups/{groupCode}/codes")
    public ResponseEntity<ApiResponse<List<CommonCodeResponse>>> getCodeByGroupo(
            @PathVariable String groupCode
    ){
        return ResponseEntity.ok(ApiResponse.ok(commonCodeService.getCodesByGroup(groupCode)));
    }

    @PutMapping("groups/{groupCode}/codes/{codeId}")
    public ResponseEntity<ApiResponse<Void>> updateCode(
            @PathVariable String groupCode,
            @PathVariable Long codeId,
            @Valid @RequestBody CommonCodeCreateRequest request
    ){
        commonCodeService.updateCode(groupCode, codeId, request);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @DeleteMapping("/groups/{groupCode}/codes/{codeId}")
    public ResponseEntity<ApiResponse<Void>> deleteCode(
            @PathVariable String groupCode,
            @PathVariable Long codeId
    ){
        commonCodeService.deleteCode(groupCode, codeId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }


}
