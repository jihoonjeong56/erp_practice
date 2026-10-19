package com.example.erp.domain.stock;

import com.example.erp.domain.item.Item;
import com.example.erp.domain.item.ItemRepository;
import com.example.erp.domain.stock.dto.StockTxRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@TestPropertySource(properties = {
        // .env를 못 읽는 환경에서도 컨텍스트가 뜨도록 테스트용 값 지정
        "jwt.secret=test-secret-key-must-be-at-least-32-characters-long",
        "jwt.expiration=86400000"
})
class StockConcurrencyTest {

    private static final int THREADS = 100;

    @Autowired StockService stockService;
    @Autowired NoLockStockService noLockStockService;
    @Autowired ItemRepository itemRepository;
    @Autowired StockRepository stockRepository;
    @Autowired StockHistoryRepository stockHistoryRepository;

    private Long itemId;

    @BeforeEach
    void setUp() {
        Item item = itemRepository.save(Item.builder()
                .itemCode("TEST-" + System.nanoTime())
                .itemName("동시성 테스트 품목")
                .unit("EA")
                .safetyStock(0)
                .build());
        stockRepository.save(Stock.builder().item(item).quantity(THREADS).build());
        itemId = item.getId();
    }

    @Test
    @DisplayName("비관적 락: 100개를 동시에 출고하면 재고가 정확히 0이 된다")
    void withLock() throws InterruptedException {
        int failures = runConcurrently(() ->
                stockService.outbound(itemId, request(1), "tester"));

        int quantity = currentQuantity();
        System.out.printf("[락 O] 실패 %d건, 최종 재고 %d, 이력 %d건%n",
                failures, quantity, stockHistoryRepository.findByItemId(itemId).size());

        assertThat(failures).isZero();
        assertThat(quantity).isZero();
        assertThat(stockHistoryRepository.findByItemId(itemId)).hasSize(THREADS);
    }

    @Test
    @DisplayName("락 없음(비교용): 동시 출고 시 갱신 손실로 재고가 0이 되지 않는다")
    void withoutLock() throws InterruptedException {
        int failures = runConcurrently(() ->
                noLockStockService.outbound(itemId, 1));

        int quantity = currentQuantity();
        int lost = quantity - failures;
        System.out.printf("[락 X] 실패 %d건, 최종 재고 %d (정상이면 0), 반영되지 못한 출고 약 %d건%n",
                failures, quantity, lost);
        // 경합 결과라 매번 값이 달라서 assert 없이 수치만 출력
    }

    private int runConcurrently(Runnable task) throws InterruptedException {
        ExecutorService pool = Executors.newFixedThreadPool(THREADS);
        CountDownLatch ready = new CountDownLatch(THREADS);
        CountDownLatch start = new CountDownLatch(1);
        CountDownLatch done = new CountDownLatch(THREADS);
        AtomicInteger failures = new AtomicInteger();

        for (int i = 0; i < THREADS; i++) {
            pool.submit(() -> {
                ready.countDown();
                try {
                    start.await();      // 모든 스레드가 준비될 때까지 대기 후 동시에 출발
                    task.run();
                } catch (Exception e) {
                    failures.incrementAndGet();
                } finally {
                    done.countDown();
                }
            });
        }

        ready.await();
        start.countDown();
        done.await(30, TimeUnit.SECONDS);
        pool.shutdown();
        return failures.get();
    }

    private StockTxRequest request(int quantity) {
        StockTxRequest request = new StockTxRequest();
        ReflectionTestUtils.setField(request, "quantity", quantity);
        return request;
    }

    private int currentQuantity() {
        return stockRepository.findAllWithItem().stream()
                .filter(s -> s.getItem().getId().equals(itemId))
                .findFirst()
                .orElseThrow()
                .getQuantity();
    }
}