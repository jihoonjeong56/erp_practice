package com.example.erp.domain.item;

import com.example.erp.common.response.ApiResponse;
import com.example.erp.domain.item.dto.ItemCreateRequest;
import com.example.erp.domain.item.dto.ItemResponse;
import com.example.erp.domain.item.dto.ItemUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @PostMapping
    public ResponseEntity<ApiResponse<Long>> create(
            @Valid @RequestBody ItemCreateRequest request
            ){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(itemService.create(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ItemResponse>>> getAll(){
        return ResponseEntity.ok(ApiResponse.ok(itemService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ItemResponse>> getItem(@PathVariable Long id){
        return ResponseEntity.ok(ApiResponse.ok(itemService.getItem(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> update(
            @PathVariable Long id,
            @Valid @RequestBody ItemUpdateRequest request
            ){
        itemService.update(id, request);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
