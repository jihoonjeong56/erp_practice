package com.example.erp.domain.employee;

// N + 1 쿼리 수 비교 테스트

import com.example.erp.domain.employee.dto.EmployeeResponse;
import com.example.erp.domain.employee.dto.EmployeeSearchCondition;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import org.hibernate.SessionFactory;
import org.hibernate.stat.Statistics;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;

@SpringBootTest
@Transactional
@TestPropertySource(properties = {
        "jwt.secret=test-secret-key-must-be-at-least-32-characters-long",
        "jwt.expiration=864000000",
        "spring.jpa.properties.hibernate.generate_statistics=true"
})
public class EmployeeQueryCountTest {
    @Autowired
    EmployeeRepository employeeRepository;
    @Autowired
    EmployeeQueryRepository employeeQueryRepository;
    @Autowired
    EntityManagerFactory entityManagerFactory;
    @Autowired
    EntityManager em;

    @Test
    @DisplayName("직원 목록 조회 : N + 1 vs fetch join vs QueryDSL 페이징 쿼리 수 비교")
    void compareQueryCount(){
        Statistics stats = entityManagerFactory.unwrap(SessionFactory.class).getStatistics();

        // 1) 지연 로딩 그대로 findAll → 연관 엔티티를 쓸 때마다 추가 쿼리 발생
        em.clear();
        stats.clear();
        List<EmployeeResponse> lazy = employeeRepository.findAll().stream()
                .map(EmployeeResponse::new).toList();
        long lazyCount = stats.getPrepareStatementCount();

        // 2) fetch join
        em.clear();
        stats.clear();
        List<EmployeeResponse> fetched = employeeRepository.findAllWithDetails().stream()
                .map(EmployeeResponse::new).toList();
        long fetchCount = stats.getPrepareStatementCount();

        // 3) QueryDSL 검색 + 페이징 (내용 조회 + count 조회)
        em.clear();
        stats.clear();
        Page<EmployeeResponse> page = employeeQueryRepository
                .search(new EmployeeSearchCondition(null, null, null, null), PageRequest.of(0, 10))
                .map(EmployeeResponse::new);
        long pageCount = stats.getPrepareStatementCount();

        System.out.printf("[N+1]            직원 %d명 조회 → 쿼리 %d회%n", lazy.size(), lazyCount);
        System.out.printf("[fetch join]     직원 %d명 조회 → 쿼리 %d회%n", fetched.size(), fetchCount);
        System.out.printf("[QueryDSL 페이징] 직원 %d명 중 %d건 조회 → 쿼리 %d회%n",
                page.getTotalElements(), page.getContent().size(), pageCount);

        assertThat(lazy).hasSameSizeAs(fetched);
        assertThat(fetchCount).isEqualTo(1);
        assertThat(lazyCount).isGreaterThan(fetchCount);
        assertThat(pageCount).isLessThanOrEqualTo(2);



    }
}
