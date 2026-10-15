package com.example.erp.domain.stock;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StockHistoryRepository extends JpaRepository<StockHistory, Long> {

    @Query("SELECT h FROM StockHistory h JOIN FETCH h.item " +
            "WHERE h.item.id = :itemId ORDER BY h.id DESC")
    List<StockHistory> findByItemId(@Param("itemId") Long itemId);
}
