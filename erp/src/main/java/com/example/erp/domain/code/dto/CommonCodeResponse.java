package com.example.erp.domain.code.dto;

import com.example.erp.domain.code.entity.CommonCode;
import lombok.Getter;

@Getter
public class CommonCodeResponse {
    private final Long id;
    private final String groupCode;
    private final String code;
    private final String codeName;
    private final int sortOrder;
    private final String useYn;

    public CommonCodeResponse(CommonCode commonCode) {
        this.id = commonCode.getId();
        this.groupCode = commonCode.getCodeGroup().getGroupCode();
        this.code =  commonCode.getCode();
        this.codeName = commonCode.getCodeName();
        this.sortOrder = commonCode.getSortOrder();
        this.useYn = commonCode.getUseYn();
    }
}
