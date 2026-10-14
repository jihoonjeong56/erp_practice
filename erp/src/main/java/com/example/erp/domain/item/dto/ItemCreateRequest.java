package com.example.erp.domain.item.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class ItemCreateRequest {
    @NotBlank(message = "품목 코드는 필수입니다.")
    private String itemCode;

    @NotBlank(message = "품목명은 필수입니다.")
    private String itemName;

    @NotBlank(message = "단위는 필수입니다.")
    private String unit;

    @NotNull(message = "안전재고는 필수입니다.")
    @Min(value = 0, message = "안전재고는 0 이상이어야 합니다.")
    private Integer safetyStock;
}
