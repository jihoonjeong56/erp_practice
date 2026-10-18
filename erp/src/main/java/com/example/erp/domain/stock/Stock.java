package com.example.erp.domain.stock;

import com.example.erp.common.exception.BusinessException;
import com.example.erp.common.response.ErrorCode;
import com.example.erp.common.utils.BaseTimeEntity;
import com.example.erp.domain.item.Item;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "stock")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Stock extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false, unique = true)
    private Item item;

    @Column(nullable = false)
    private int quantity;

    @Builder
    public Stock(Item item, int quantity) {
        this.item = item;
        this.quantity = quantity;
    }

    public void increase(int amount){
        this.quantity += amount;
    }

    public void decrease(int amount){
        if(this.quantity < amount){
            throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK);
        }
        this.quantity -= amount;
    }
}
