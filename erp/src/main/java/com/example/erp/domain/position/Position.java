package com.example.erp.domain.position;

import com.example.erp.common.utils.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "position")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Position extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String posCode;

    @Column(nullable = false, length = 50)
    private String posName;

    @Column(nullable = false)
    private int level;

    @Column(nullable = false, length = 1)
    private String useYn = "Y";

    @Builder
    public Position(String posCode, String posName, int level, String useYn) {
        this.posCode = posCode;
        this.posName = posName;
        this.level = level;
        this.useYn = useYn != null ? useYn : "Y";
    }

    public void update(String posName, int level, String useYn) {
        this.posName = posName;
        this.level = level;
        this.useYn = useYn;
    }
}
