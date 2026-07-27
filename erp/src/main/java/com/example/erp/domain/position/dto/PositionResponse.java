package com.example.erp.domain.position.dto;

import com.example.erp.domain.position.Position;
import lombok.Getter;

@Getter
public class PositionResponse {
    private final Long id;
    private final String posCode;
    private final String posName;
    private final int level;
    private final String useYn;

    public PositionResponse(Position position){
        this.id = position.getId();
        this.posCode = position.getPosCode();
        this.posName = position.getPosName();
        this.level = position.getLevel();
        this.useYn = position.getUseYn();
    }
}
