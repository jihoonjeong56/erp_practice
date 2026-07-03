package com.example.erp.domain.code.repository;

import com.example.erp.domain.code.entity.CodeGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CodeGroupRepository extends JpaRepository<CodeGroup, String> {
    List<CodeGroup> findByUseYnOrderByGroupCode(String useYn);
    boolean existsByGroupCode(String groupCode);
}
