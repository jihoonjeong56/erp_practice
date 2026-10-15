package com.example.erp.domain.stock.dto;

import com.example.erp.domain.stock.Stock;
import com.example.erp.domain.stock.StockHistory;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class StockHistoryResponse {
    private final Long id;
    private final Long itemId;
    private final String itemName;
    private final String txType;
    private final int quantity;
    private final int afterQuantity;
    private final String memo;
    private final String processedBy;
    private final LocalDateTime createdAt;

    public  StockHistoryResponse(StockHistory h) {
        this.id = h.getId();
        this.itemId = h.getItem().getId();
        this.itemName = h.getItem().getItemName();
        this.txType = h.getTxType().name();
        this.quantity = h.getQuantity();
        this.afterQuantity = h.getAfterQuantity();
        this.memo = h.getMemo();
        this.processedBy = h.getProcessedBy();
        this.createdAt = h.getCreatedAt();
    }
}
