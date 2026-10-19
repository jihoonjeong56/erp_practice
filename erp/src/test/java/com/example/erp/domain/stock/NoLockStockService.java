package com.example.erp.domain.stock;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// 락 없이 읽고 수정하는 비교용 서비스 (테스트 전용)
@Service
@RequiredArgsConstructor
public class NoLockStockService {
    public final StockRepository stockRepository;

    @Transactional
    public void outbound(Long itemId, int amount){
        Stock stock = stockRepository.findAllWithItem().stream()
                .filter(s -> s.getItem().getId().equals(itemId))
                .findFirst()
                .orElseThrow();

        try {
            Thread.sleep(10); // 경합 구간을 넓혀서 갱신 손실이 확실히 보임
        }catch (InterruptedException e){
            Thread.currentThread().interrupt();
        }
        stock.decrease(amount);
    }
}
