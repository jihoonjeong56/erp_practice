package com.example.erp.domain.stock;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Long> {

    // 비관적 락: select ... for update 트랜잭션이 끝날 때까지 다른 요청은 대기
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Stock s WHERE s.item.id = :itemId")
    Optional<Stock> findByItemIdForUpdate(@Param("itemId") Long itemId);

    @Query("SELECT s FROM Stock s JOIN FETCH s.item ORDER BY s.item.itemCode")
    List<Stock> findAllWithItem();
}
