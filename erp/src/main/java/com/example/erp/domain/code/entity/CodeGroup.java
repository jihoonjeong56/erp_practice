package com.example.erp.domain.code.entity;

import com.example.erp.common.utils.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "code_group")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CodeGroup extends BaseTimeEntity {
    @Id
    @Column(length = 30)
    private String groupCode;

    @Column(nullable = false, length = 100)
    private String groupName;

    @Column(length = 255)
    private String description;

    @Column(nullable = false, length = 1)
    private String useYn = "Y";

    @OneToMany(mappedBy = "codeGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CommonCode> codes = new ArrayList<>();

    @Builder
    public CodeGroup(String groupCode, String groupName, String description, String useYn) {
        this.groupCode = groupCode;
        this.groupName = groupName;
        this.description = description;
        this.useYn = useYn != null ? useYn : "Y";
    }

    public void update(String groupName, String description, String useYn) {
        this.groupName = groupName;
        this.description = description;
        this.useYn = useYn;
    }
}
