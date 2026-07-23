package com.example.erp.domain.position;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PositionRepository extends JpaRepository<Long, Position> {
    boolean existsByPosCode(String posCode);
    List<Position> findByUseYnOrderByLevelDesc(String useYn);
    boolean existsByIdAndEmployees_IdNotNull(Long id);
}
