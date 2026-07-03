package com.example.erp.domain.code.dto;

import com.example.erp.domain.code.entity.CodeGroup;
import lombok.Getter;

import java.util.List;

@Getter
public class CodeGroupResponse {
    private final String groupCode;
    private final String groupName;
    private final String description;
    private final String useYn;
    private final List<CommonCodeResponse> code;

    public CodeGroupResponse(CodeGroup codeGroup) {
        this.groupCode = codeGroup.getGroupCode();
        this.groupName = codeGroup.getGroupName();
        this.description = codeGroup.getDescription();
        this.useYn = codeGroup.getUseYn();
        this.code = codeGroup.getCodes().stream()
                .map(CommonCodeResponse::new)
                .toList();
    }
}
