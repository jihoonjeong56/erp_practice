package com.example.erp.domain.position;

import com.example.erp.common.exception.BusinessException;
import com.example.erp.common.response.ErrorCode;
import com.example.erp.domain.position.dto.PositionCreateRequest;
import com.example.erp.domain.position.dto.PositionResponse;
import com.example.erp.domain.position.dto.PositionUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
                        .build()
        ).getId();
    }

    public List<PositionResponse> getAll(){
        return positionRepository.findByUseYnOrderByLevelDesc("Y")
                .stream()
                .map(PositionResponse::new)
                .toList();
    }

    public PositionResponse getPosition(Long id){
        return new PositionResponse(positionRepository.findById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.POSITION_NOT_FOUND)));
    }

    @Transactional
    public void update(Long id,  PositionUpdateRequest request){
        Position position = positionRepository.findById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.POSITION_NOT_FOUND));
        position.update(request.getPosName(), request.getLevel(), "Y");
    }

    @Transactional
    public void delete(Long id){
        Position position = positionRepository.findById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.POSITION_NOT_FOUND));
        positionRepository.delete(position);
    }
}
