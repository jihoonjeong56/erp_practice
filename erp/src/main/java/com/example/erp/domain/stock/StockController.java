package com.example.erp.domain.stock;

import com.example.erp.common.response.ApiResponse;
import com.example.erp.domain.stock.dto.StockHistoryResponse;
import com.example.erp.domain.stock.dto.StockResponse;
import com.example.erp.domain.stock.dto.StockTxRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockController {
    private final StockService stockService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<StockResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(stockService.getAll()));
    }

    @GetMapping("/{itemId}/histories")
    public ResponseEntity<ApiResponse<List<StockHistoryResponse>>> getHistories(
            @PathVariable Long itemId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(stockService.getHistories(itemId)));
    }

    @PostMapping("/{itemId}/in")
    public ResponseEntity<ApiResponse<Void>> inbound(
            @PathVariable Long itemId,
            @Valid @RequestBody StockTxRequest request,
            @AuthenticationPrincipal String username
    ) {
        stockService.inbound(itemId, request, username);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @PostMapping("/{itemId}/out")
    public ResponseEntity<ApiResponse<Void>> outbound(
            @PathVariable Long itemId,
            @Valid @RequestBody StockTxRequest request,
            @AuthenticationPrincipal String username
    ) {
        stockService.outbound(itemId, request, username);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }


}
