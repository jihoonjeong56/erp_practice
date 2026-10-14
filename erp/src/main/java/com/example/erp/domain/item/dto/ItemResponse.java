package com.example.erp.domain.item.dto;

import com.example.erp.domain.item.Item;
import lombok.Getter;

@Getter
public class ItemResponse {
    private final Long id;
    private final String itemCode;
    private final String itemName;
    private final String unit;
    private final int safetyStock;
    private final String useYn;


    public ItemResponse(Item item) {
        this.id = item.getId();
        this.itemCode = item.getItemCode();
        this.itemName = item.getItemName();
        this.unit = item.getUnit();
        this.safetyStock = item.getSafetyStock();
        this.useYn = item.getUseYn();
    }
}
