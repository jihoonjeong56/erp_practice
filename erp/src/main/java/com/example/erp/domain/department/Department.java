package com.example.erp.domain.department;

import com.example.erp.common.utils.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "department")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Department extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String deptCode;

    @Column(nullable = false, length = 100)
    private String deptName;

    @Column(length = 255)
    private String description;

    @Column(nullable = false)
    private int sortOrder;

    @Column(nullable = false, length = 1)
    private String useYn = "Y";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Department parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<Department> children = new ArrayList<>();

    @Builder
    public Department(String deptCode, String deptName, String description, int sortOrder, String useYn, Department parent) {
        this.deptCode = deptCode;
        this.deptName = deptName;
        this.description = description;
        this.sortOrder = sortOrder;
        this.useYn = useYn != null ? useYn : "Y";
        this.parent = parent;
    }

    //수정
    public void update (String deptName, String description, int sortOrder, String useYn, Department parent) {
        this.deptName  = deptName;
        this.description = description;
        this.sortOrder = sortOrder;
        this.useYn = useYn;
        this.parent = parent;
    }

}
