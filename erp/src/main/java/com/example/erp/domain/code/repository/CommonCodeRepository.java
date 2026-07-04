package com.example.erp.domain.code.repository;

import com.example.erp.domain.code.entity.CommonCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommonCodeRepository extends JpaRepository<CommonCode, Long> {
    List<CommonCode> findByCodeGroup_GroupCodeAndUseYnOrderBySortOrderAsc(String groupCode, String useYn);
    boolean existsByCodeGroup_GroupCodeAndCode(String groupCode, String code);
}
