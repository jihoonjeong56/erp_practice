package com.example.erp.domain.item;

import com.example.erp.common.utils.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "item")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Item extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String itemCode;

    @Column(nullable = false, length = 100)
    private String itemName;

    @Column(nullable = false, length = 20)
    private String unit;

    @Column(nullable = false)
    private int safetyStock;

    @Column(nullable = false, length = 1)
    private String useYn = "Y";

    @Builder
    public Item(String itemCode, String itemName, String unit, int safetyStock) {
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.unit = unit;
        this.safetyStock = safetyStock;
        this.useYn = "Y";
    }

    public void update(String itemName, String unit, int safetyStock, String useYn) {
        this.itemName = itemName;
        this.unit = unit;
        this.safetyStock = safetyStock;
        this.useYn = useYn;
    }
}
