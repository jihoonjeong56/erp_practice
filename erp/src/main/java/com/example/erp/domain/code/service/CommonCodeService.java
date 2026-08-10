package com.example.erp.domain.code.service;

import com.example.erp.common.exception.BusinessException;
import com.example.erp.common.response.ErrorCode;
import com.example.erp.domain.code.dto.*;
import com.example.erp.domain.code.entity.CodeGroup;
import com.example.erp.domain.code.entity.CommonCode;
import com.example.erp.domain.code.repository.CodeGroupRepository;
import com.example.erp.domain.code.repository.CommonCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommonCodeService {
    private final CommonCodeRepository commonCodeRepository;
    private final CodeGroupRepository codeGroupRepository;

    @Transactional
    public String createGroup(CodeGroupCreateRequest request) {
        if (codeGroupRepository.existsByGroupCode(request.getGroupCode())) {
            throw new BusinessException(ErrorCode.DUPLICATE_CODE_CROUP);
        }
        CodeGroup group = CodeGroup.builder()
                .groupCode(request.getGroupCode())
                .groupName(request.getGroupName())
                .description(request.getDescription())
                .build();
        return codeGroupRepository.save(group).getGroupCode();
    }

    public List<CodeGroupResponse> getAllGroups() {
        return codeGroupRepository.findByUseYnOrderByGroupCode("Y")
                .stream()
                .map(CodeGroupResponse::new)
                .toList();
    }

    public CodeGroupResponse getGroup(String groupCode) {
        CodeGroup group = codeGroupRepository.findById(groupCode)
                .orElseThrow(() -> new BusinessException(ErrorCode.CODE_GROUP_NOT_FOUNT));
        return new CodeGroupResponse(group);
    }

    @Transactional
    public void updateGroup(String groupCode, CodeGroupCreateRequest request) {
        CodeGroup group = codeGroupRepository.findById(groupCode)
                .orElseThrow(() -> new BusinessException(ErrorCode.CODE_GROUP_NOT_FOUNT));
        group.update(request.getGroupName(), request.getDescription(), "Y");
    }

    @Transactional
    @CacheEvict(value = "commonCode", key = "#groupCode") // 캐시 무효화
    public Long createCode(String groupCode, CommonCodeCreateRequest request) {
        CodeGroup group = codeGroupRepository.findById(groupCode)
                .orElseThrow(() -> new BusinessException(ErrorCode.CODE_GROUP_NOT_FOUNT));

        if (commonCodeRepository.existsByCodeGroup_GroupCodeAndCode(groupCode, request.getCode())) {
            throw new BusinessException(ErrorCode.DUPLICATE_COMMON_CODE);
        }
        CommonCode code = CommonCode.builder()
                .codeGroup(group)
                .code(request.getCode())
                .codeName(request.getCodeName())
                .sortOrder(request.getSortOrder())
                .build();

        return commonCodeRepository.save(code).getId();
    }


    @CacheEvict(value = "commonCode", key = "#groupCode")
    public List<CommonCodeResponse> getCodesByGroup(String groupCode) {
        return commonCodeRepository
                .findByCodeGroup_GroupCodeAndUseYnOrderBySortOrderAsc(groupCode, "Y")
                .stream()
                .map(CommonCodeResponse::new)
                .toList();
    }

    @Transactional
    @CacheEvict(value = "commonCode", key = "#groupCode")
    public void updateCode(String groupCode, Long codeId, CommonCodeUpdateRequest request) {
        CommonCode code = commonCodeRepository.findById(codeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMON_CODE_NOT_FOUNT));
        code.update(request.getCodeName(), request.getSortOrder(), "Y");

    }

    @Transactional
    @CacheEvict(value = "commonCode", key = "#groupCode")
    public void deleteCode(String groupCode, Long codeId) {
        CommonCode code = commonCodeRepository.findById(codeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMON_CODE_NOT_FOUNT));
        commonCodeRepository.delete(code);
    }


}
