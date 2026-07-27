package com.example.erp.domain.position;

import com.example.erp.common.exception.BusinessException;
import com.example.erp.common.response.ErrorCode;
import com.example.erp.domain.position.dto.PositionCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PositionService {

    private final PositionRepository positionRepository;

    @Transactional
    public Long create(PositionCreateRequest request){
        if(positionRepository.existsByPosCode(request.getPosCode())){
            throw new BusinessException(ErrorCode.DUPLICATE_POSITION_CODE);
        }
        return positionRepository.save(
                Position.builder()
                        .posCode(request.getPosCode())
                        .posName(request.getPosName())
                        .level(request.getLevel())
                        .build().getId()
        );
    }
}
