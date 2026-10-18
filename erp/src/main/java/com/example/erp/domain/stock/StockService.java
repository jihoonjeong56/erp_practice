package com.example.erp.domain.stock;

import com.example.erp.common.exception.BusinessException;
import com.example.erp.common.response.ErrorCode;
import com.example.erp.domain.stock.dto.StockHistoryResponse;
import com.example.erp.domain.stock.dto.StockResponse;
import com.example.erp.domain.stock.dto.StockTxRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StockService {
    private final StockRepository stockRepository;
    private final StockHistoryRepository stockHistoryRepository;

    public List<StockResponse> getAll(){
        return stockRepository.findAllWithItem().stream()
                .map(StockResponse::new)
                .toList();
    }

    public List<StockHistoryResponse> getHistories(Long itemId){
        return stockHistoryRepository.findByItemId(itemId).stream()
                .map(StockHistoryResponse::new)
                .toList();
    }

    @Transactional
    public void inbound(Long itemId, StockTxRequest request, String username){
        process(itemId, StockTxType.IN, request, username);
    }

    @Transactional
    public void outbound(Long itemId, StockTxRequest request, String username){
        process(itemId, StockTxType.OUT, request, username);
    }

    private void process(Long itemId, StockTxType type,
                         StockTxRequest request, String username) {
        Stock stock = stockRepository.findByItemIdForUpdate(itemId)
                .orElseThrow(() -> new BusinessException(ErrorCode.STOCK_NOT_FOUND));

        int amount = request.getQuantity();
        if (type == StockTxType.IN){
            stock.increase(amount);
        } else {
            stock.decrease(amount); // 부족하면 INSUFFICIENT_STOCK 예외 → 전체 롤백
        }

        stockHistoryRepository.save(StockHistory.builder()
                        .item(stock.getItem())
                        .txType(type)
                        .quantity(stock.getQuantity())
                        .afterQuantity(stock.getQuantity())
                        .memo(request.getMemo())
                        .processedBy(username)
                .build());

    }

}
