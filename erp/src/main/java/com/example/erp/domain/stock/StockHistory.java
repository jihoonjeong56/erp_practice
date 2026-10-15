package com.example.erp.domain.stock;

import com.example.erp.common.utils.BaseTimeEntity;
import com.example.erp.domain.item.Item;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "stock_history")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StockHistory extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private StockTxType txType;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private int afterQuantity;

    @Column(length = 255)
    private String memo;

    @Column(length = 50)
    private String processedBy;

    @Builder
    public StockHistory(Item item, StockTxType txType, int quantity, int afterQuantity, String memo, String processedBy) {
        this.item = item;
        this.txType = txType;
        this.quantity = quantity;
        this.afterQuantity = afterQuantity;
        this.memo = memo;
        this.processedBy = processedBy;
    }
}
