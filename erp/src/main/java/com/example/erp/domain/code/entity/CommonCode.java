package com.example.erp.domain.code.entity;

import com.example.erp.common.utils.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "common_code",
uniqueConstraints = @UniqueConstraint(
        columnNames = {"group_code", "code"}
))
@Getter
@NoArgsConstructor
public class CommonCode extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_code", nullable = false)
    private CodeGroup codeGroup;

    @Column(nullable = false, length = 30)
    private String code;

    @Column(nullable = false, length = 100)
    private String codeName;

    @Column(nullable = false)
    private int sortOrder;

    @Column(nullable = false, length = 1)
    private String useYn = "Y";

    @Builder
    public CommonCode(CodeGroup codeGroup, String code, String codeName, int sortOrder, String useYn) {
        this.codeGroup = codeGroup;
        this.code = code;
        this.codeName = codeName;
        this.sortOrder = sortOrder;
        this.useYn = useYn != null ? useYn : "Y";
    }

    public void update(String codeName, int sortOrder, String useYn) {
        this.codeName = codeName;
        this.sortOrder = sortOrder;
        this.useYn = useYn;
    }
}
