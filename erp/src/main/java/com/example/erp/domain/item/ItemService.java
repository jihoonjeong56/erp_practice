package com.example.erp.domain.item;

import com.example.erp.common.exception.BusinessException;
import com.example.erp.common.response.ErrorCode;
import com.example.erp.domain.item.dto.ItemCreateRequest;
import com.example.erp.domain.item.dto.ItemResponse;
import com.example.erp.domain.item.dto.ItemUpdateRequest;
import com.example.erp.domain.stock.Stock;
import com.example.erp.domain.stock.StockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ItemService {

    private final ItemRepository itemRepository;
    private final StockRepository stockRepository;

    @Transactional
    public Long create(ItemCreateRequest request) {
        if (itemRepository.existsByItemCode(request.getItemCode())) {
            throw new BusinessException(ErrorCode.DUPLICATE_ITEM_CODE);
        }
        Item item = itemRepository.save(Item.builder()
                .itemCode(request.getItemCode())
                .itemName(request.getItemName())
                .unit(request.getUnit())
                .safetyStock(request.getSafetyStock())
                .build());
        stockRepository.save(Stock.builder().item(item).quantity(0).build());
        return item.getId();
    }

    public List<ItemResponse> getAll() {
        return itemRepository.findAll().stream()
                .map(ItemResponse::new)
                .toList();
    }

    public ItemResponse getItem(Long id) {
        return new ItemResponse(itemRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.ITEM_NOT_FOUND)));
    }

    @Transactional
    public void update(Long id, ItemUpdateRequest request) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.ITEM_NOT_FOUND));
        item.update(request.getItemName(), request.getUnit(), request.getSafetyStock(), request.getUseYn());
    }
}
