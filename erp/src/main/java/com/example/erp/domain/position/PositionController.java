package com.example.erp.domain.position;


import com.example.erp.common.response.ApiResponse;
import com.example.erp.domain.position.dto.PositionCreateRequest;
import com.example.erp.domain.position.dto.PositionResponse;
import com.example.erp.domain.position.dto.PositionUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/position`")
@RequiredArgsConstructor
public class PositionController {
    private final PositionService positionService;

    @PostMapping
    public ResponseEntity<ApiResponse<Long>> create(@Valid @RequestBody PositionCreateRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(positionService.create(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PositionResponse>>> getAll(){
        return ResponseEntity.ok(ApiResponse.ok(positionService.getAll()));
    }

    @GetMapping("/${id}")
    public ResponseEntity<ApiResponse<PositionResponse>> getPosition(@PathVariable Long id){
        return ResponseEntity.ok(ApiResponse.ok(positionService.getPosition(id)));
    }

    @PutMapping("/${id}")
    public ResponseEntity<ApiResponse<Void>> update(@PathVariable Long id,
                                                    @Valid @RequestBody PositionUpdateRequest request){
        positionService.update(id, request);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @DeleteMapping("/${id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id){
        positionService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
