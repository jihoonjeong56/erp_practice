package com.example.erp.domain.stock.dto;

import com.example.erp.domain.item.Item;
import com.example.erp.domain.stock.Stock;
import lombok.Getter;

@Getter
public class StockResponse {
    private final Long itemId;
    private final String itemCode;
    private final String itemName;
    private final String unit;
    private final int quantity;
    private final int safetyStock;
    private final boolean lowStock; // 안전재고 미달 여부

    public StockResponse(Stock stock) {
        Item item = stock.getItem();
        this.itemId = item.getId();
        this.itemCode = item.getItemCode();
        this.itemName = item.getItemName();
        this.unit = item.getUnit();
        this.quantity = stock.getQuantity();
        this.safetyStock = item.getSafetyStock();
        this.lowStock = stock.getQuantity() < item.getSafetyStock();
    }
}
